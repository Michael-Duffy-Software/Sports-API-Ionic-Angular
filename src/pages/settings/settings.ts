	// IMPORTS
	import { Component } from '@angular/core';
	import { IonicPage, NavController, NavParams } from 'ionic-angular';
	import { Storage } from '@ionic/storage';
	import { HomePage } from '../home/home';

	@IonicPage()
	@Component({
	  selector: 'page-settings',
	  templateUrl: 'settings.html',
	})

	// SETTING PAGE
	export class SettingsPage {

		countryId : number;
		minimumAge : number;
		maximumAge : number;
		countryIdEntered : number;
		minimumAgeEntered : number;
		maximumAgeEntered : number;

	// CONSTRUCTOR
	constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {}

	// LOAD PAGE EACH TIME
	ionViewDidLoad() {
		console.log('ionViewDidLoad SettingsPage');
	}
	  
	// NGONIT
	ngOnInit() {
		this.storage.get("country").then((val) => {
			this.countryId = val
		});
		
		this.storage.get("minimumAge").then((val) => {
			this.minimumAge = val
		});
		
		this.storage.get("maximumAge").then((val) => {
			this.maximumAge = val
		});
	}

	// SAVE BUTTON
	saveButton() {

		if(this.countryIdEntered == null || this.countryIdEntered < 9 || this.countryIdEntered > 132){
			alert("Please enter a Country ID in the range 9 - 132.");
			this.clearInputValues();
		}
		else if (this.maximumAgeEntered < this.minimumAgeEntered) {
			alert("Minimum age must be less than maximum age.");
			this.clearInputValues();
		}
		else if (this.maximumAgeEntered < 0 || this.minimumAgeEntered < 0) {
			alert("Age must be greater than 0.");
			this.clearInputValues();
		}
	  
		else{
			this.countryId = Math.round(this.countryIdEntered);
			this.storage.set("country", this.countryId);
			
			if (this.minimumAgeEntered == null) {
				this.storage.set("minimumAge",null);
			} 
			else {
				this.minimumAge = Math.round(this.minimumAgeEntered);
				this.storage.set("minimumAge",this.minimumAge);
			} 
			if (this.maximumAgeEntered == null) {
				this.storage.set("maximumAge",null);
			} 
			else {
				this.maximumAge = Math.round(this.maximumAgeEntered);
				this.storage.set("maximumAge",this.maximumAge);
			}
		  
			this.clearInputValues();
			this.navCtrl.setRoot(HomePage); 
		}
	   
	}

	// RESET SETTINGS
	resetSettings() {
		this.storage.clear();
		this.countryId = null;
		this.minimumAge = null;
		this.maximumAge = null;
		this.clearInputValues();
		this.navCtrl.setRoot(HomePage);
	}
	  
	// CLEAR INPUT VALUES
	clearInputValues() {
		this.countryIdEntered = null;
		this.minimumAgeEntered = null;
		this.maximumAgeEntered = null;
	}
  
}
