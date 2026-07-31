"use client";

export type AssistantAction={
label:string;
command:string;
};

export const defaultActions:AssistantAction[]=[
{
label:"📊 Dashboard",
command:"Ouvre le tableau de bord"
},
{
label:"📦 Réceptions",
command:"Ouvre les réceptions"
},
{
label:"🚚 Expéditions",
command:"Ouvre les expéditions"
},
{
label:"📦 Stock",
command:"Ouvre le stock"
},
{
label:"⚙️ ERP",
command:"Connecte mon ERP"
},
{
label:"📋 Briefing",
command:"Fais le briefing du matin"
}
];
