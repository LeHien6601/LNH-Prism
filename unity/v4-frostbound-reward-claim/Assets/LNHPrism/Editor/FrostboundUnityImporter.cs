using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using UnityEditor;
using UnityEditor.U2D;
using UnityEngine;
using UnityEngine.U2D;

namespace LNHPrism.Editor
{
    public static class FrostboundUnityImporter
    {
        public const string ProfileId = "unity-6000-ugui-builtin-android-portrait";
        public const string EditorVersion = "6000.3.18f1";
        public const string GeneratedRoot = "Assets/LNHPrism/Generated";
        public const string AtlasPath = GeneratedRoot + "/ui-frostbound-reward.spriteatlas";
        public const string BindingsPath = GeneratedRoot + "/FrostboundBindings.asset";
        static string ProjectRoot => Directory.GetParent(Application.dataPath)!.FullName;
        static string RepoRoot => Path.GetFullPath(Path.Combine(Application.dataPath, "../../.."));
        static string BundleRoot => Path.Combine(RepoRoot, "docs/validation/evidence/m4-s2-frostbound-unity-bundle/bundle");

        [MenuItem("LNH Prism/Import Frostbound Bundle")]
        public static void ImportFromMenu() => ImportBundle();

        public static void RunBatch()
        {
            try { ImportBundle(); EditorApplication.Exit(0); }
            catch (Exception exception) { Debug.LogException(exception); EditorApplication.Exit(1); }
        }

        internal static ImportReceipt ImportBundle()
        {
            var diagnostics = new List<string>();
            try
            {
                if (Application.unityVersion != EditorVersion) throw new InvalidOperationException($"Expected Unity {EditorVersion}, got {Application.unityVersion}.");
                var manifestDirectory = Path.Combine(BundleRoot, "Manifests");
                var manifests = Directory.GetFiles(manifestDirectory, "*.manifest.json").OrderBy(path => path, StringComparer.Ordinal).Select(LoadManifest).ToArray();
                var registry = JsonUtility.FromJson<Registry>(File.ReadAllText(Path.Combine(BundleRoot, "unity-asset-registry.json")));
                Preflight(manifests, registry);
                var declaredPaths=manifests.SelectMany(manifest=>manifest.outputs).Select(output=>output.path.Replace('/',Path.DirectorySeparatorChar)).ToHashSet(StringComparer.OrdinalIgnoreCase);
                var generatedDirectory=Path.Combine(ProjectRoot,GeneratedRoot);
                if(Directory.Exists(generatedDirectory)) foreach(var existing in Directory.GetFiles(generatedDirectory,"*.png",SearchOption.AllDirectories)) if(!declaredPaths.Contains(Path.GetRelativePath(ProjectRoot,existing))) diagnostics.Add($"stale:{Path.GetRelativePath(ProjectRoot,existing).Replace('\\','/')}");

                var created = 0; var updated = 0; var unchanged = 0;
                Directory.CreateDirectory(Path.Combine(ProjectRoot, GeneratedRoot));
                AssetDatabase.StartAssetEditing();
                try
                {
                    foreach (var output in manifests.SelectMany(manifest => manifest.outputs).OrderBy(output => output.unity.assetId, StringComparer.Ordinal))
                    {
                        var destination = Path.Combine(ProjectRoot, output.path);
                        Directory.CreateDirectory(Path.GetDirectoryName(destination)!);
                        var existed = File.Exists(destination);
                        var same = existed && Sha256(destination) == output.sha256;
                        if (!same) File.Copy(Path.Combine(BundleRoot, output.path), destination, true);
                        EnsureMetaGuid(destination + ".meta", output.unity.metaGuid);
                        if (!existed) created++; else if (!same) updated++; else unchanged++;
                    }
                }
                finally { AssetDatabase.StopAssetEditing(); }
                CopySupportFiles(manifestDirectory);
                AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);

                foreach (var output in manifests.SelectMany(manifest => manifest.outputs)) ApplyImporter(output);
                AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport | ImportAssetOptions.ForceUpdate);
                CreateAtlas(manifests.SelectMany(manifest => manifest.outputs).ToArray());
                CreateBindings(manifests.SelectMany(manifest => manifest.outputs).ToArray());
                FrostboundProjectBuilder.CreatePrefabsAndScene();
                AssetDatabase.SaveAssets();
                AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);
                var receipt = new ImportReceipt { generatedAt=DateTime.UtcNow.ToString("O"), unityVersion=Application.unityVersion, profileId=ProfileId, status="pass", registrySha256=Sha256(Path.Combine(BundleRoot,"unity-asset-registry.json")), manifestSha256=Directory.GetFiles(manifestDirectory,"*.manifest.json").OrderBy(path=>path,StringComparer.Ordinal).Select(path=>Sha256(path)).ToArray(), sourceTreeSha256=manifests.Select(manifest=>manifest.provenance.sourceTreeSha256).ToArray(), outputSha256=manifests.SelectMany(manifest=>manifest.outputs).OrderBy(output=>output.unity.assetId,StringComparer.Ordinal).Select(output=>output.sha256).ToArray(), created=created, updated=updated, unchanged=unchanged, rejected=0, diagnostics=diagnostics.ToArray() };
                WriteReceipt(receipt); return receipt;
            }
            catch (Exception exception)
            {
                diagnostics.Add(exception.Message);
                var receipt = new ImportReceipt { generatedAt=DateTime.UtcNow.ToString("O"), unityVersion=Application.unityVersion, profileId=ProfileId, status="fail", rejected=1, diagnostics=diagnostics.ToArray() };
                WriteReceipt(receipt); throw;
            }
        }

        static Manifest LoadManifest(string path) => JsonUtility.FromJson<Manifest>(File.ReadAllText(path));

        static void Preflight(Manifest[] manifests, Registry registry)
        {
            if (manifests.Length != 5) throw new InvalidDataException("Expected exactly five Frostbound manifests.");
            if (registry == null || registry.entries == null || registry.entries.Length != 28 || registry.profileId != ProfileId) throw new InvalidDataException("Registry must contain exactly 28 entries for the approved profile.");
            var ids = new HashSet<string>(StringComparer.OrdinalIgnoreCase); var paths = new HashSet<string>(StringComparer.OrdinalIgnoreCase); var guids = new HashSet<string>(StringComparer.OrdinalIgnoreCase); var declared=new Dictionary<string,Output>(StringComparer.Ordinal);
            foreach (var manifest in manifests)
            {
                if (manifest.schemaVersion != "1.1" || manifest.unityIntegration.profileId != ProfileId || manifest.unityIntegration.editorVersion != EditorVersion || manifest.unityIntegration.uiSystem != "ugui" || manifest.unityIntegration.renderPipeline != "built-in" || manifest.unityIntegration.targetPlatform != "android" || manifest.unityIntegration.orientation != "portrait" || manifest.unityIntegration.importerVersion != "0.1.0" || manifest.unityIntegration.referenceResolution.width != 540 || manifest.unityIntegration.referenceResolution.height != 960) throw new InvalidDataException("Manifest Unity profile mismatch.");
                foreach (var source in manifest.provenance.sourceFiles)
                    if (Sha256(Path.Combine(RepoRoot, source.path), true) != source.sha256) throw new InvalidDataException($"Source hash mismatch: {source.path}.");
                foreach (var output in manifest.outputs)
                {
                    if (!output.path.StartsWith(GeneratedRoot + "/", StringComparison.Ordinal) || output.path.Contains("..") || Path.IsPathRooted(output.path)) throw new InvalidDataException($"Unsafe output path {output.path}.");
                    if (Sha256(Path.Combine(BundleRoot, output.path)) != output.sha256) throw new InvalidDataException($"Output hash mismatch: {output.path}.");
                    if (!ids.Add(output.unity.assetId) || !paths.Add(output.path) || !guids.Add(output.unity.metaGuid)) throw new InvalidDataException("Case-folded ID, path, or GUID collision.");
                    declared.Add(output.unity.assetId,output);
                    if (output.unity.pixelsPerUnit != 100 || output.unity.atlasGroup != "ui-frostbound-reward" || output.unity.spriteMode != "single" || output.unity.meshType != "full-rect" || output.unity.filterMode != "bilinear" || output.unity.wrapMode != "clamp" || output.unity.mipmaps || !output.unity.alphaIsTransparency || output.unity.compression != "uncompressed") throw new InvalidDataException($"Unsupported importer setting for {output.unity.assetId}.");
                    if (output.unity.border.left + output.unity.border.right >= output.width || output.unity.border.top + output.unity.border.bottom >= output.height) throw new InvalidDataException($"Collapsed Sprite center for {output.unity.assetId}.");
                }
            }
            var ordered = registry.entries.Select(entry => entry.unityAssetId).ToArray();
            if (!ordered.SequenceEqual(ordered.OrderBy(value => value, StringComparer.Ordinal))) throw new InvalidDataException("Registry is not ordinally sorted.");
            foreach (var entry in registry.entries)
                if (!declared.TryGetValue(entry.unityAssetId,out var output) || output.path!=entry.path || output.unity.metaGuid!=entry.metaGuid || output.sha256!=entry.outputSha256 || Sha256(Path.Combine(BundleRoot, entry.path)) != entry.outputSha256) throw new InvalidDataException($"Registry drift for {entry.unityAssetId}.");
        }

        static void EnsureMetaGuid(string metaPath, string expectedGuid)
        {
            if (File.Exists(metaPath))
            {
                var match = Regex.Match(File.ReadAllText(metaPath), @"(?m)^guid:\s*([a-f0-9]{32})$");
                if (!match.Success || match.Groups[1].Value != expectedGuid) throw new InvalidDataException($"Existing meta GUID mismatch at {metaPath}.");
                return;
            }
            File.WriteAllText(metaPath, $"fileFormatVersion: 2\nguid: {expectedGuid}\n");
        }

        static void CopySupportFiles(string manifestDirectory)
        {
            var destination=Path.Combine(ProjectRoot,GeneratedRoot,"Manifests"); Directory.CreateDirectory(destination);
            foreach(var source in Directory.GetFiles(manifestDirectory,"*.manifest.json")) CopyIfChanged(source,Path.Combine(destination,Path.GetFileName(source)));
            CopyIfChanged(Path.Combine(BundleRoot,"unity-asset-registry.json"),Path.Combine(ProjectRoot,GeneratedRoot,"unity-asset-registry.json"));
        }

        static void CopyIfChanged(string source,string destination)
        {
            if(!File.Exists(destination)||Sha256(source)!=Sha256(destination)) File.Copy(source,destination,true);
        }

        static void ApplyImporter(Output output)
        {
            var importer = (TextureImporter)AssetImporter.GetAtPath(output.path);
            if (importer == null) throw new InvalidDataException($"TextureImporter missing for {output.path}.");
            importer.textureShape=TextureImporterShape.Texture2D; importer.textureType=TextureImporterType.Sprite; importer.spriteImportMode=SpriteImportMode.Single; importer.spritePixelsPerUnit=output.unity.pixelsPerUnit;
            importer.spritePivot=new Vector2(output.unity.pivot.x,output.unity.pivot.y); importer.spriteBorder=new Vector4(output.unity.border.left,output.unity.border.bottom,output.unity.border.right,output.unity.border.top);
            var textureSettings=new TextureImporterSettings(); importer.ReadTextureSettings(textureSettings); textureSettings.spriteMeshType=SpriteMeshType.FullRect; importer.SetTextureSettings(textureSettings);
            importer.alphaIsTransparency=true; importer.filterMode=FilterMode.Bilinear; importer.wrapMode=TextureWrapMode.Clamp; importer.mipmapEnabled=false; importer.textureCompression=TextureImporterCompression.Uncompressed;
            importer.SaveAndReimport();
            AssetDatabase.ImportAsset(output.path,ImportAssetOptions.ForceSynchronousImport|ImportAssetOptions.ForceUpdate);
        }

        static void CreateAtlas(Output[] outputs)
        {
            var atlas=AssetDatabase.LoadAssetAtPath<SpriteAtlas>(AtlasPath);
            if(atlas==null){ atlas=new SpriteAtlas(); AssetDatabase.CreateAsset(atlas,AtlasPath); }
            atlas.Remove(atlas.GetPackables());
            var sprites=outputs.OrderBy(output=>output.unity.assetId,StringComparer.Ordinal).Select(output=>(UnityEngine.Object)LoadSprite(output.path)).ToArray();
            atlas.Add(sprites); var settings=atlas.GetPackingSettings(); settings.enableRotation=false; settings.enableTightPacking=false; atlas.SetPackingSettings(settings); EditorUtility.SetDirty(atlas);
        }

        static void CreateBindings(Output[] outputs)
        {
            var bindings=AssetDatabase.LoadAssetAtPath<FrostboundBindings>(BindingsPath);
            if(bindings==null){ bindings=ScriptableObject.CreateInstance<FrostboundBindings>(); AssetDatabase.CreateAsset(bindings,BindingsPath); }
            bindings.profileId=ProfileId;
            bindings.sprites=outputs.OrderBy(output=>output.unity.assetId,StringComparer.Ordinal).Select(output=>new FrostboundSpriteBinding{assetId=output.unity.assetId,state=output.state,sprite=LoadSprite(output.path)}).ToArray();
            bindings.lockedEmblemColor=new Color32(111,135,152,173); EditorUtility.SetDirty(bindings);
        }

        static string Sha256(string path, bool normalizeText=false)
        {
            using var algorithm=SHA256.Create(); byte[] bytes;
            if(normalizeText) bytes=Encoding.UTF8.GetBytes(File.ReadAllText(path).Replace("\r\n","\n")); else bytes=File.ReadAllBytes(path);
            return string.Concat(algorithm.ComputeHash(bytes).Select(value=>value.ToString("x2")));
        }

        static Sprite LoadSprite(string path)
        {
            var assets=AssetDatabase.LoadAllAssetsAtPath(path); var sprite=assets.OfType<Sprite>().SingleOrDefault();
            if(sprite==null) throw new InvalidDataException($"Declared Sprite failed to import: {path}; main={AssetDatabase.GetMainAssetTypeAtPath(path)?.FullName ?? "null"}; assets={string.Join(",",assets.Select(asset=>asset?.GetType().FullName ?? "null"))}.");
            return sprite;
        }

        static void WriteReceipt(ImportReceipt receipt)
        {
            var directory=Path.Combine(RepoRoot,"docs/validation/evidence/m4-s3-unity-import"); Directory.CreateDirectory(directory);
            File.WriteAllText(Path.Combine(directory,"import-receipt.json"),JsonUtility.ToJson(receipt,true)+"\n");
        }
    }
}
