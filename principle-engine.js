/* Life OS V2.0 — Principle Engine
 * 将十大定论从“说明文字”提升为执行决策规则。
 */
const principleEngine={
  洗衣论:{label:'行动优先',guard:'先处理眼前明确且必要的行动；需要深入思考的问题进入思维停车区。'},
  砍柴论:{label:'专注当前程序',guard:'执行当前任务时，不主动切换到其他程序；新想法先停车。'},
  拔刀论:{label:'清除阻碍',guard:'发现会持续打断当前行动的因素时，优先移除或隔离。'},
  相处论:{label:'关系需要相处',guard:'关系程序优先采用真实相处，不用单纯勾选任务替代关系。'},
  物归论:{label:'秩序归位',guard:'任务完成后立即恢复环境、物品和工作位置。'},
  绝对论:{label:'原则坚定、方法可调',guard:'保持系统边界，但允许根据现实调整具体方法。'},
  积累论:{label:'持续积累',guard:'优先完成可重复的小行动，而不是等待完美条件。'},
  复利论:{label:'长期重复',guard:'优先保护长期有效的习惯与节奏，不为短期波动频繁改系统。'},
  容错论:{label:'允许修正',guard:'失败不等于退出系统；记录、归位、修正，然后继续。'},
  万事归位论:{label:'总纲',guard:'每件事情进入自己的位置，每个程序履行自己的职责。'}
};
function getPrincipleDecision(name){return principleEngine[name]||principleEngine['万事归位论']}
function getCurrentPrinciple(){const p=programs[currentProgram];return getPrincipleDecision(p?.rule)}
function principleGuard(action){const p=getCurrentPrinciple();return {allow:true,principle:p.label,message:p.guard,action}}
function showPrincipleDecision(){const d=principleGuard('当前行动');const el=document.querySelector('#principleDecision');if(el)el.textContent=`${d.principle}：${d.message}`}
window.lifeOSPrincipleEngine={getCurrentPrinciple,principleGuard,showPrincipleDecision};
