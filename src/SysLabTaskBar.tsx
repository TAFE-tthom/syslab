// import { SysLabContextData } from './SysLabContext';


// export type SetDataCallback = (data: SysLabContextData) => void;

// export type SysLabSelectorProps = {
//   parentData: SysLabContextData
//   setData: SetDataCallback
//   storage: StorageInstance
//   visible: boolean
//   setVisible: (s: boolean) => void;
// }

// /**
//  * Selector Column where the user can select the exercise
//  * they want to work on
//  */
// export function SysLabTaskSelectorColumn(props: SysLabSelectorProps) {

//   const setData = props.setData;
//   const data = props.parentData;
//   const selectedPack = data.selectedPack;
//   const selected = data.selected;
//   const currentPack = data.currentPack;
//   const storage = props.storage;
//   const visibleState = props.visible;
//   const setVisible = props.setVisible;
  
//   const isVisible = visibleState ?  'visible' : 'hidden';

//   useEffect(() => {
//     const handleRes = () => {
//       const docWidth = (document.getRootNode() as any)
//         .body.clientWidth;
//       if(docWidth > 700) {
//         setVisible(true);
//       }
//     };

//     window.addEventListener('resize', handleRes);
    
//   });

//   const progressKeys = props.parentData.exercises.map((pe) => {
//     const exercises: Array<string> = [];
//     pe.tasks.forEach(te => exercises.push(te.name))
//     return exercises;
//   }).reduce((pa, ca) => pa.concat(ca));

//   const [progMap, progArray] = storage.progression(progressKeys);
  
//   const buttonSelect = (n: number, p: number) => {
//     const newState = {...data};
//     newState.selected = n;
//     newState.selectedPack = p;
//     newState.currentPack = p;
//     setData(newState);    
//   };

//   const selectPack = (n: number) => {
//     const newState = {...data};
//     newState.selectedPack = n;
//     setData(newState);    
//   };

//   const packItems = props.parentData
//     .exercises.map((e, i: number) => {
//     let navItems: Array<ReactElement> = [];

//     if(selectedPack === i) {
//       navItems = 
//       e.tasks.map((e, idx: number) => {

//         //TODO: Replace e.name with e.key
//         const progKey = KeyPrefixes.FormatForProgress(e.name);
//         const progIndex = progMap.get(progKey);
//         const progObj = progIndex !== undefined && progIndex >= 0 ? progArray[progIndex] : { completed: false };

//         const selectedItemStyle = progObj.completed ? 'taskSelectNavItemCompleted' :
//           (selected !== undefined
//           && selected === idx
//           && selectedPack === currentPack) ? "taskSelectNavItemSoftChosen" :
//           "taskSelectNavItemSoft";
//         return (<>
//           <li key={`navitem_extra_${idx}`} onClick={() => buttonSelect(idx, i)}
//           className={`${selectedItemStyle}`}>
//             {e.name}
//           </li>
//           </>)
//       });
//     }
    
//     const selectedPackStyle = (selectedPack !== undefined
//       && selectedPack === i) ? "taskSelectNavItemChosen" : "taskSelectNavItem";
    
//     return (<>
//       <li key={`navitem_${i}`} onClick={() => selectPack(i)}
//       className={`${selectedPackStyle}`}>
//           ⛁ : {e.topic}
//       </li>
//       {navItems}
//       </>);
//   });
  

