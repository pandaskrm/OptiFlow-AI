"use client";

type Action={
label:string;
icon:string;
};

const actions:Action[]=[
{icon:"📊",label:"Dashboard"},
{icon:"📦",label:"Réceptions"},
{icon:"🚚",label:"Expéditions"},
{icon:"📦",label:"Stock"},
{icon:"👥",label:"Équipe"},
{icon:"⚙️",label:"ERP"},
{icon:"📋",label:"Briefing IA"}
];

export default function AssistantQuickActions(){

return(

<div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">

{actions.map(action=>(

<button
key={action.label}
className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow transition hover:shadow-lg hover:scale-[1.02]"
>

<div className="text-2xl">
{action.icon}
</div>

<div className="mt-2 font-semibold">
{action.label}
</div>

</button>

))}

</div>

);

}
