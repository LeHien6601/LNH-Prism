using System;
using UnityEngine;

namespace LNHPrism
{
    [Serializable]
    public sealed class FrostboundSpriteBinding
    {
        public string assetId;
        public string state;
        public Sprite sprite;
    }

    [CreateAssetMenu(menuName = "LNH Prism/Frostbound Bindings")]
    public sealed class FrostboundBindings : ScriptableObject
    {
        public string profileId;
        public FrostboundSpriteBinding[] sprites = Array.Empty<FrostboundSpriteBinding>();
        public Color lockedEmblemColor = new Color32(111, 135, 152, 173);

        public Sprite Find(string assetId)
        {
            foreach (var binding in sprites)
                if (binding.assetId == assetId) return binding.sprite;
            throw new InvalidOperationException($"Missing Frostbound binding {assetId}.");
        }
    }
}
