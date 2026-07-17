using System;
using System.IO;
using System.Linq;
using NUnit.Framework;
using UnityEditor;
using UnityEditor.U2D;
using UnityEngine;
using UnityEngine.U2D;
using UnityEngine.UI;

namespace LNHPrism.Tests
{
    public sealed class FrostboundImportTests
    {
        const string GeneratedRoot="Assets/LNHPrism/Generated";

        [Test] public void UsesPinnedEditorAndCompleteStableBindings()
        {
            Assert.That(Application.unityVersion,Is.EqualTo("6000.3.18f1"));
            var bindings=AssetDatabase.LoadAssetAtPath<FrostboundBindings>(GeneratedRoot+"/FrostboundBindings.asset");
            Assert.That(bindings,Is.Not.Null); Assert.That(bindings.profileId,Is.EqualTo("unity-6000-ugui-builtin-android-portrait")); Assert.That(bindings.sprites.Length,Is.EqualTo(28));
            Assert.That(bindings.sprites.Select(binding=>binding.assetId).Distinct(StringComparer.OrdinalIgnoreCase).Count(),Is.EqualTo(28)); Assert.That(bindings.sprites.All(binding=>binding.sprite!=null),Is.True);
            Assert.That((Color32)bindings.lockedEmblemColor,Is.EqualTo(new Color32(111,135,152,173)));
            Assert.That(bindings.sprites.Count(binding=>binding.assetId.Contains("claim-button")),Is.EqualTo(6)); Assert.That(bindings.sprites.Count(binding=>binding.assetId.Contains("later-button")),Is.EqualTo(6));
            Assert.That(bindings.sprites.Count(binding=>binding.assetId.Contains("progress-fill")),Is.EqualTo(8)); Assert.That(bindings.sprites.Count(binding=>binding.assetId.Contains("progress-frame")),Is.EqualTo(2));
            Assert.That(bindings.sprites.Count(binding=>binding.assetId.Contains("emblem-container")),Is.EqualTo(5)); Assert.That(bindings.sprites.Single(binding=>binding.state=="locked").assetId,Does.Contain("lock-badge"));
        }

        [Test] public void AppliesEveryDeclaredTextureImporterSetting()
        {
            var bindings=AssetDatabase.LoadAssetAtPath<FrostboundBindings>(GeneratedRoot+"/FrostboundBindings.asset");
            foreach(var binding in bindings.sprites)
            {
                var path=AssetDatabase.GetAssetPath(binding.sprite); var importer=(TextureImporter)AssetImporter.GetAtPath(path);
                Assert.That(importer.textureShape,Is.EqualTo(TextureImporterShape.Texture2D),path); Assert.That(importer.textureType,Is.EqualTo(TextureImporterType.Sprite),path); Assert.That(importer.spriteImportMode,Is.EqualTo(SpriteImportMode.Single),path); Assert.That(importer.spritePixelsPerUnit,Is.EqualTo(100),path);
                var textureSettings=new TextureImporterSettings(); importer.ReadTextureSettings(textureSettings);
                Assert.That(importer.spritePivot,Is.EqualTo(new Vector2(.5f,.5f)),path); Assert.That(textureSettings.spriteMeshType,Is.EqualTo(SpriteMeshType.FullRect),path); Assert.That(importer.filterMode,Is.EqualTo(FilterMode.Bilinear),path); Assert.That(importer.wrapMode,Is.EqualTo(TextureWrapMode.Clamp),path);
                Assert.That(importer.mipmapEnabled,Is.False,path); Assert.That(importer.alphaIsTransparency,Is.True,path); Assert.That(importer.textureCompression,Is.EqualTo(TextureImporterCompression.Uncompressed),path);
                var expected=binding.assetId.Contains("reward-panel") ? new Vector4(48,48,48,48) : binding.assetId.Contains("claim-button") ? new Vector4(36,24,36,24) : binding.assetId.Contains("later-button") ? new Vector4(30,20,30,20) : binding.assetId.Contains("progress-frame") ? new Vector4(28,14,28,14) : Vector4.zero;
                Assert.That(importer.spriteBorder,Is.EqualTo(expected),path);
            }
            var panel=bindings.sprites.Single(binding=>binding.assetId.EndsWith("panel-normal-432x300",StringComparison.Ordinal)).sprite;
            Assert.That(panel.border,Is.EqualTo(new Vector4(48,48,48,48)));
        }

        [Test] public void AtlasContainsExactlyTheDeclaredSprites()
        {
            var atlas=AssetDatabase.LoadAssetAtPath<SpriteAtlas>(GeneratedRoot+"/ui-frostbound-reward.spriteatlas"); Assert.That(atlas,Is.Not.Null);
            var packables=atlas.GetPackables(); Assert.That(packables.Length,Is.EqualTo(28)); Assert.That(packables.All(item=>item is Sprite),Is.True);
        }

        [Test] public void PrefabsAndSceneKeepResolvableSpriteReferences()
        {
            foreach(var name in new[]{"RewardPanel","RewardPanelTall","PrimaryClaim","SecondaryLater","RewardProgress","RewardEmblem","FrostboundRewardClaim"}) Assert.That(AssetDatabase.LoadAssetAtPath<GameObject>($"Assets/LNHPrism/Prefabs/{name}.prefab"),Is.Not.Null,name);
            var panel=AssetDatabase.LoadAssetAtPath<GameObject>("Assets/LNHPrism/Prefabs/RewardPanel.prefab"); var image=panel.GetComponent<Image>(); Assert.That(image.sprite,Is.Not.Null); Assert.That(image.type,Is.EqualTo(Image.Type.Sliced)); Assert.That(((RectTransform)panel.transform).sizeDelta,Is.EqualTo(new Vector2(432,300)));
            var tall=AssetDatabase.LoadAssetAtPath<GameObject>("Assets/LNHPrism/Prefabs/RewardPanelTall.prefab"); Assert.That(tall.GetComponent<Image>().sprite,Is.SameAs(image.sprite)); Assert.That(((RectTransform)tall.transform).sizeDelta,Is.EqualTo(new Vector2(432,420)));
            var claim=AssetDatabase.LoadAssetAtPath<GameObject>("Assets/LNHPrism/Prefabs/PrimaryClaim.prefab").GetComponent<Button>(); Assert.That(claim.targetGraphic,Is.TypeOf<Image>()); Assert.That(((Image)claim.targetGraphic).sprite,Is.Not.Null); Assert.That(claim.spriteState.pressedSprite,Is.Not.Null); Assert.That(claim.spriteState.disabledSprite,Is.Not.Null);
            var scene=AssetDatabase.LoadAssetAtPath<SceneAsset>("Assets/LNHPrism/Scenes/V4FrostboundRewardClaim.unity"); Assert.That(scene,Is.Not.Null);
            Assert.That(AssetDatabase.GetDependencies("Assets/LNHPrism/Scenes/V4FrostboundRewardClaim.unity",true).Any(path=>path.EndsWith("FrostboundRewardClaim.prefab",StringComparison.Ordinal)),Is.True);
        }
    }
}
