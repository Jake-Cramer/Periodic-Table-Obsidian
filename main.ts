import {Plugin, ItemView, WorkspaceLeaf} from 'obsidian';
import periodicJson from "./periodicTable.json";
import fitty from 'fitty';

export const PERIODIC_VIEW = "periodic-view";

export default class MyPlugin extends Plugin{
	onload(){
		const infoView = this.app.workspace.getLeavesOfType(PERIODIC_VIEW)[0];
		if(!infoView){
			this.registerView(
				PERIODIC_VIEW,
				(leaf) => new PeriodicView(leaf)
			);
		}
        this.activateView();
	}

	onunload(){
	}

	async activateView(){
		await this.app.workspace.getRightLeaf(false).setViewState({
			type: PERIODIC_VIEW,
			active: false
		});
	}
}

export class PeriodicView extends ItemView{
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return PERIODIC_VIEW;
	}

	getDisplayText() {
		return "Periodic table";
	}

	async onOpen() {
		this.containerEl.empty();
		this.containerEl.createDiv(
			{cls: "mainDiv"},
			(div) => {
				for(let i = 0; i < 9; i++){
					div.createDiv(
						{cls: "subDiv"},
						(div) =>{
							for(let j = 0; j < 18; j++){
								const num: number = this.setElementData((i*18) + j);
								const tempDiv = div.createDiv(
									{cls: "element", attr: 
										{id: PeriodicView.setElementDataToString(num)}},
	
									(div) => {
										div.createEl("p", {text: num.toString(), cls:"numOfEl"});
										if(num > -1){
											div.createEl("p", {text: periodicJson[num - 1].symbol, cls:"elSymb"});
										}
									}
								);
								tempDiv.addEventListener('click', function(){
									const element = periodicJson[num - 1];
									dataDiv.children[0].id = PeriodicView.setElementDataToString(num);
									dataDiv.children[0].children[0].children[0].textContent = element.number.toString();
									dataDiv.children[0].children[0].children[1].textContent = element.atomicMass.toString();
									dataDiv.children[0].children[1].textContent = element.symbol;
									dataDiv.children[0].children[2].textContent = element.name;
									fitty('#name');
									dataDiv.children[1].textContent = "Category: " + element.category;
									dataDiv.children[2].textContent = "Electron configuration: \n" + element.electronConfig;
									dataDiv.children[3].textContent = "Group: " + element.group.toString();
									dataDiv.children[4].textContent = "Period: " + element.period.toString();
									dataDiv.children[5].textContent = "Number of valence electrons: " + PeriodicView.findValenceElectrons(num).toString();
									dataDiv.children[6].textContent = "Oxidation states: " + element.oxidationStates;
									dataDiv.children[7].textContent = "Atomic radius: " + element.atomicRadius;
									dataDiv.children[8].textContent = "Phase: " + element.phase;
								});
							}
						}
					);				
				}
			}
		);
		const dataDiv = createDiv(
			{cls: "dataDiv"},
			(div) => {
				div.createDiv(
					{cls: "bigElement"},
					(div) => {
						div.createDiv({cls: "numberAndMass"}, (div) => {
							div.createEl("p", {cls: "number"});
							div.createEl("p", {cls: "mass"});
						});
						div.createEl("h1", {cls: "symbol"});
						div.createEl("div", {cls: "name"});
					}
				);
				div.createEl("div", {cls: "category attrib"});
				div.createEl("div", {cls: "electron-config attrib"});
				div.createEl("div", {cls: "group attrib"});
				div.createEl("div", {cls: "period attrib"});
				div.createEl("div", {cls: "valence attrib"});
				div.createEl("div", {cls: "oxidationStates attrib"});
				div.createEl("div", {cls: "atomicRadius attrib"});
				div.createEl("div", {cls: "phase attrib"});
			}
		);
		this.containerEl.appendChild(dataDiv);
	}

	private setElementData(num: number): number{
		if(num == 0) return 1; // hydrogen
		if(num > 0 && num < 17) return -1;
		num -= 15; 
		if(num <= 4) return num;// 2 - 4
		if(num > 4 && num < 15) return -1;
		num -= 10;
		if(num <= 12) return num; // 5-12
		if(num > 12 && num < 23) return -1;
		num -= 10;
		if(num > 57) num += 14;// exerpt for the bottom blocks
		if(num > 89) num += 14;
		if(num > 118 && num < 121) return -1;
		if(num > 134 && num < 139) return -1;
		if(num > 152) return -1;
		if(num > 137) num += 14;
		if(num > 118) num -= 63;
		return num;
	}
	static setElementDataToString(num: number): string{
		if(num == -1) return "nonExistant";
		// will return the group name
		num = num - 1;
		let str = periodicJson[num].category;
		
		if(str == "polyatomic nonmetal") str = "nonmetal";
		else if(str == "diatomic nonmetal") str = "nonmetal";
		else if(str == "noble gas") str = "noble-gas";
		else if(str == "alkali metal") str = "alkali-metal";
		else if(str == "alkaline earth metal") str = "alkaline-earth-metal";
		else if(str == "post-transition metal") str = "post-transition-metal";
		else if(str == "transition metal") str = "transition-metal";
		else if(str.startsWith("unknown")) str = "unknown";
		return str;
	}

	static findValenceElectrons(num: number): number{
		num -= 1;
		const group = periodicJson[num].group;
		if(group < 3) return group;
		if(group > 12) return group % 10;

		// transition metals
		const electronConfigString = periodicJson[num].electronConfig
		const electronConfigArr = electronConfigString.split(" ");
		let maxOrbit = 0;
		for(let i = 0; i < electronConfigArr.length; i++){
			if(parseInt(electronConfigArr[i].charAt(0)) > maxOrbit){
				maxOrbit = i;
			}
		}
		return parseInt(electronConfigArr[maxOrbit].charAt(2));
	}

	async onClose() {
		this.unload();
	}
}
