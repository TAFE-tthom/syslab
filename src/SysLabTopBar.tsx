import style from "./styles/SysLabContext.module.css";


export type SysLabTopBarData = {}


export const SysLabTopBar = (_props: SysLabTopBarData) => {
  return (
    <div className={style.syslabTopBar}>
      <span className={style.syslabTopBarSpan}>SysLab</span>
    </div>
  )
}
