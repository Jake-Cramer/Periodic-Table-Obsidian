import {Plugin, ItemView, WorkspaceLeaf, Notice} from 'obsidian';
import periodicJson from "./PeriodicTableJSON.json";

export const PERIODIC_VIEW = "periodic-view";

export default class MyPlugin extends Plugin{
	onload(){
		
		this.registerView(
			PERIODIC_VIEW,
			(leaf) => new ExampleView(leaf)
		);
		this.activateView();
	}

	onunload(){}

	async activateView(){
		this.app.workspace.detachLeavesOfType(PERIODIC_VIEW);

		await this.app.workspace.getRightLeaf(false).setViewState({
			type: PERIODIC_VIEW,
			active: true
		});

		this.app.workspace.revealLeaf(this.app.workspace.getLeavesOfType(PERIODIC_VIEW)[0]);
	}
}

export class ExampleView extends ItemView{
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return PERIODIC_VIEW;
	}

	getDisplayText() {
		return "Example view";
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
								let num: number = this.setElementData((i*18) + j);
								const tempDiv = div.createDiv(
									{cls: "element", attr: 
										{id: ExampleView.setElementDataToString(num)}},
	
									(div) => {
										div.createEl("p", {text: num.toString(), cls:"numOfEl"});
										if(num > -1){
											div.createEl("p", {text: periodicJson.elements[num - 1].symbol});
										}
									}
								);
								tempDiv.addEventListener('click', function(event){
									let element = periodicJson.elements[num - 1];
									dataDiv.children[0].id = ExampleView.setElementDataToString(num);
									dataDiv.children[0].children[0].children[0].textContent = element.number.toString();
									dataDiv.children[0].children[0].children[1].textContent = element.atomic_mass.toString();
									dataDiv.children[0].children[1].textContent = element.symbol;
									dataDiv.children[0].children[2].textContent = element.name;
									dataDiv.children[1].textContent = element.category;
									dataDiv.children[2].textContent = element.electron_configuration;
									dataDiv.children[3].textContent = element.group.toString();
									dataDiv.children[4].textContent = element.period.toString();
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
						div.createEl("h2", {cls: "symbol"});
						div.createEl("h5", {cls: "name"});
					}
				);
				div.createEl("h3", {cls: "category"});
				div.createEl("h3", {cls: "electron-config"});
				div.createEl("h3", {cls: "group"});
				div.createEl("h3", {cls: "period"});

				//group
				//row
				//normal state
			}
		);
		this.containerEl.appendChild(dataDiv);


		/*
		const container = this.containerEl.children[1];
		container.empty();
		container.createEl("h4", { text: "Example view" });
		*/
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
		let str = periodicJson.elements[num].category;
		
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


	async onClose() {
		this.unload();
	}
}
