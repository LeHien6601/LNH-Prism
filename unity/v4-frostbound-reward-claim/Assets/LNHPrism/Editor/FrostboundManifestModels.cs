using System;

namespace LNHPrism.Editor
{
    [Serializable] internal sealed class Manifest { public string schemaVersion; public string generatedAt; public UnityIntegration unityIntegration; public Output[] outputs; public Provenance provenance; }
    [Serializable] internal sealed class UnityIntegration { public string profileId; public string editorVersion; public string uiSystem; public string renderPipeline; public Resolution referenceResolution; public string targetPlatform; public string orientation; public string importerVersion; }
    [Serializable] internal sealed class Resolution { public int width; public int height; }
    [Serializable] internal sealed class Provenance { public string sourceTreeSha256; public SourceFile[] sourceFiles; }
    [Serializable] internal sealed class SourceFile { public string role; public string path; public string sha256; }
    [Serializable] internal sealed class Output { public string path; public string sha256; public string state; public int width; public int height; public UnitySettings unity; }
    [Serializable] internal sealed class UnitySettings { public string assetId; public string metaGuid; public float pixelsPerUnit; public Pivot pivot; public Border border; public string atlasGroup; public string spriteMode; public string meshType; public string filterMode; public string wrapMode; public bool mipmaps; public bool alphaIsTransparency; public string compression; }
    [Serializable] internal sealed class Pivot { public float x; public float y; }
    [Serializable] internal sealed class Border { public int left; public int right; public int top; public int bottom; }
    [Serializable] internal sealed class Registry { public string schemaVersion; public string profileId; public RegistryEntry[] entries; }
    [Serializable] internal sealed class RegistryEntry { public string unityAssetId; public string metaGuid; public string path; public string outputSha256; }
    [Serializable] internal sealed class ImportReceipt { public string schemaVersion = "1.0"; public string importerVersion = "0.1.0"; public string generatedAt; public string unityVersion; public string profileId; public string status; public string registrySha256; public string[] manifestSha256; public string[] sourceTreeSha256; public string[] outputSha256; public int created; public int updated; public int unchanged; public int rejected; public string[] diagnostics; }
}
