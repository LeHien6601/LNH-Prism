using System;
using System.IO;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

namespace LNHPrism.Editor
{
    internal static class FrostboundProjectBuilder
    {
        const string PrefabRoot="Assets/LNHPrism/Prefabs";
        const string ScenePath="Assets/LNHPrism/Scenes/V4FrostboundRewardClaim.unity";

        public static void CreatePrefabsAndScene()
        {
            Directory.CreateDirectory(Path.Combine(Directory.GetParent(Application.dataPath)!.FullName,PrefabRoot));
            Directory.CreateDirectory(Path.Combine(Directory.GetParent(Application.dataPath)!.FullName,"Assets/LNHPrism/Scenes"));
            AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);
            var bindings=AssetDatabase.LoadAssetAtPath<FrostboundBindings>(FrostboundUnityImporter.BindingsPath);
            if(bindings==null) throw new InvalidDataException("Frostbound bindings were not generated.");
            var panel=CreateImagePrefab("RewardPanel",bindings.Find("lnh-prism:frostbound-reward-frostbound-reward-panel-normal-432x300"),new Vector2(432,300),Image.Type.Sliced);
            CreateImagePrefab("RewardPanelTall",bindings.Find("lnh-prism:frostbound-reward-frostbound-reward-panel-normal-432x300"),new Vector2(432,420),Image.Type.Sliced);
            var primary=CreateButtonPrefab("PrimaryClaim",bindings,"frostbound-reward-frostbound-claim-button",240,64);
            var secondary=CreateButtonPrefab("SecondaryLater",bindings,"frostbound-reward-frostbound-later-button",160,52);
            var progress=CreateProgressPrefab(bindings);
            var emblem=CreateEmblemPrefab(bindings);
            CreateComposedPrefab(panel,primary,secondary,progress,emblem);
            CreateScene();
        }

        static GameObject CreateImagePrefab(string name,Sprite sprite,Vector2 size,Image.Type type)
        {
            var root=UiObject(name,size); var image=root.AddComponent<Image>(); image.sprite=sprite; image.type=type;
            var prefab=PrefabUtility.SaveAsPrefabAsset(root,$"{PrefabRoot}/{name}.prefab"); UnityEngine.Object.DestroyImmediate(root); return prefab;
        }

        static GameObject CreateButtonPrefab(string name,FrostboundBindings bindings,string stem,int width,int height)
        {
            string Id(string state)=>$"lnh-prism:{stem}-{state}-{width}x{height}";
            var root=UiObject(name,new Vector2(width,height)); var image=root.AddComponent<Image>(); image.sprite=bindings.Find(Id("normal")); image.type=Image.Type.Sliced;
            var button=root.AddComponent<Button>(); button.transition=Selectable.Transition.SpriteSwap; button.targetGraphic=image;
            button.spriteState=new SpriteState{highlightedSprite=image.sprite,pressedSprite=bindings.Find(Id("pressed")),selectedSprite=image.sprite,disabledSprite=bindings.Find(Id("disabled"))};
            var prefab=PrefabUtility.SaveAsPrefabAsset(root,$"{PrefabRoot}/{name}.prefab"); UnityEngine.Object.DestroyImmediate(root); return prefab;
        }

        static GameObject CreateProgressPrefab(FrostboundBindings bindings)
        {
            var root=UiObject("RewardProgress",new Vector2(320,28));
            var frame=root.AddComponent<Image>(); frame.sprite=bindings.Find("lnh-prism:frostbound-reward-frostbound-reward-progress-frame-normal-320x28"); frame.type=Image.Type.Sliced;
            var fill=UiObject("Fill",new Vector2(320,28)); fill.transform.SetParent(root.transform,false); var image=fill.AddComponent<Image>(); image.sprite=bindings.Find("lnh-prism:frostbound-reward-frostbound-reward-progress-fill-75-normal-320x28"); image.type=Image.Type.Simple;
            var prefab=PrefabUtility.SaveAsPrefabAsset(root,$"{PrefabRoot}/RewardProgress.prefab"); UnityEngine.Object.DestroyImmediate(root); return prefab;
        }

        static GameObject CreateEmblemPrefab(FrostboundBindings bindings)
        {
            var root=UiObject("RewardEmblem",new Vector2(104,104)); var image=root.AddComponent<Image>(); image.sprite=bindings.Find("lnh-prism:frostbound-reward-frostbound-reward-emblem-container-normal-104x104");
            var selectable=root.AddComponent<Button>(); selectable.targetGraphic=image;
            var lockBadge=UiObject("LockBadge",new Vector2(48,48)); lockBadge.transform.SetParent(root.transform,false); lockBadge.AddComponent<Image>().sprite=bindings.Find("lnh-prism:frostbound-reward-frostbound-reward-emblem-container-lock-badge-locked-48x48"); lockBadge.SetActive(false);
            var prefab=PrefabUtility.SaveAsPrefabAsset(root,$"{PrefabRoot}/RewardEmblem.prefab"); UnityEngine.Object.DestroyImmediate(root); return prefab;
        }

        static void CreateComposedPrefab(params GameObject[] parts)
        {
            var root=UiObject("FrostboundRewardClaim",new Vector2(432,420));
            var y=new[]{0f,110f,-105f,-150f,35f};
            for(var index=0;index<parts.Length;index++){ var child=(GameObject)PrefabUtility.InstantiatePrefab(parts[index]); child.transform.SetParent(root.transform,false); ((RectTransform)child.transform).anchoredPosition=new Vector2(0,y[index]); }
            PrefabUtility.SaveAsPrefabAsset(root,$"{PrefabRoot}/FrostboundRewardClaim.prefab"); UnityEngine.Object.DestroyImmediate(root);
        }

        static void CreateScene()
        {
            var scene=EditorSceneManager.NewScene(NewSceneSetup.EmptyScene,NewSceneMode.Single);
            var camera=new GameObject("Main Camera").AddComponent<Camera>(); camera.gameObject.tag="MainCamera"; camera.clearFlags=CameraClearFlags.SolidColor; camera.backgroundColor=new Color32(7,17,31,255); camera.orthographic=true;
            var canvasObject=new GameObject("Canvas",typeof(RectTransform),typeof(Canvas),typeof(CanvasScaler),typeof(GraphicRaycaster)); var canvas=canvasObject.GetComponent<Canvas>(); canvas.renderMode=RenderMode.ScreenSpaceOverlay;
            var scaler=canvasObject.GetComponent<CanvasScaler>(); scaler.uiScaleMode=CanvasScaler.ScaleMode.ScaleWithScreenSize; scaler.referenceResolution=new Vector2(540,960); scaler.screenMatchMode=CanvasScaler.ScreenMatchMode.MatchWidthOrHeight; scaler.matchWidthOrHeight=.5f;
            var prefab=AssetDatabase.LoadAssetAtPath<GameObject>($"{PrefabRoot}/FrostboundRewardClaim.prefab"); var instance=(GameObject)PrefabUtility.InstantiatePrefab(prefab,scene); instance.transform.SetParent(canvasObject.transform,false);
            new GameObject("EventSystem",typeof(EventSystem),typeof(StandaloneInputModule));
            EditorSceneManager.SaveScene(scene,ScenePath); EditorBuildSettings.scenes=new[]{new EditorBuildSettingsScene(ScenePath,true)};
        }

        static GameObject UiObject(string name,Vector2 size)
        {
            var result=new GameObject(name,typeof(RectTransform)); ((RectTransform)result.transform).sizeDelta=size; return result;
        }
    }
}
