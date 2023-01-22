//IMPORTS
import { NavController } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

// CLASS HOME PAGE
export class HomePage implements OnInit {
	
	// INSTANCE VARIABLES
	personQuoted : string;
	personQuotedDisplay : string;
	quoteTopicResult : string;
	quoteTopicDisplay : string;
	quoteListed : string;
	countryId : number = null;
	countryIdDisplay : string;
	minimumAge : number = null;
	minimumAgeDisplay : string;
	maximumAge : number = null;
	maximumAgeDisplay : string;
	checkQuoteString : string = "famous-quotes";
	apiKey : string = "77531aa0-78c0-11ed-adfe-cf1867ee5434";
	countryNameDisplay : string;
	countryNameResult : string = null;
	countryFlagUrlLink : string = "";
	noPlayerDataToDisplay : string = "";
	playersArray : string[];

	// CONSTRUCTOR
	constructor(public navCtrl: NavController,private http:HttpClient, private storage : Storage) {}
	  
	// LOAD PAGE FIRST TIME
	ngOnInit() {}
	   
	// LOAD PAGE EACH TIME
	ionViewWillEnter() {
		this.loadQuote();
		this.loadSportsData();	  
	  }
	  
    // NAVIGATE TO SETTINGS PAGE
	openSettingsPage() {
		this.navCtrl.push(SettingsPage);
	  }
	  
	// LOAD QUOTE INFORMATION AND DISPLAY RESULT
	loadQuote(){
	  
			this.callQuoteAPI().subscribe(quoteResult => {
				this.personQuoted = quoteResult.author;
				this.quoteTopicResult = quoteResult.tags[0];
				this.quoteListed = quoteResult.content;
				this.checkQuoteString = this.quoteTopicResult;
				if (this.checkQuoteString == "famous-quotes"){
					this.quoteTopicDisplay = "";
					this.personQuotedDisplay = this.personQuoted + ".";
				}
				else {
					this.personQuotedDisplay = this.personQuoted;
					this.quoteTopicDisplay = "about " + this.quoteTopicResult + ".";
				}
			});
	  
	  }
	  
	// CALL QUOTE API
	callQuoteAPI(): Observable<any> {
		return this.http.get("https://api.quotable.io/random")
	  }
	  
	// LOAD SPORTS DATA
	loadSportsData() {
	  
		  this.storage.get("country").then((val) => {
			this.countryId = val
			if (this.countryId == null) {
				this.countryIdDisplay = "No Settings Selected";
				this.hideTable();	
			} 
			else {
				this.countryIdDisplay = "Country ID : " + this.countryId;
				this.storage.get("minimumAge").then((val) => {
					this.minimumAge = val
					if (this.minimumAge == null) {
						this.minimumAgeDisplay = null;
						this.storage.get("maximumAge").then((val) => {
							this.maximumAge = val
							if (this.maximumAge == null) {
								this.maximumAgeDisplay = null;
								this.sportsAPI();	
							} 
							else {
								this.maximumAgeDisplay = "  /  Maximum Age : " + this.maximumAge;
								this.sportsAPI();
							}
						});
						
					} 
					else {
						this.minimumAgeDisplay = "  /  Minimum Age : " + this.minimumAge;
						this.storage.get("maximumAge").then((val) => {
							this.maximumAge = val
							if (this.maximumAge == null) {
								this.maximumAgeDisplay = null;
								this.sportsAPI();			
							} 
							else {
								this.maximumAgeDisplay = "  /  Maximum Age : " + this.maximumAge;
								this.sportsAPI();	
							}		
						});
					}
				});
			
			}
			});
	}
	
	// CALL SPORTS APIs
	sportsAPI() {
		this.loadCountryNameAndFlag();
		this.loadPlayerData();
	}
	
	// LOAD COUNTRY NAME & FLAG
	loadCountryNameAndFlag(){
			this.callCountryNameAPI().subscribe(countryResult => {
				this.countryNameResult = countryResult.data.name;
				this.countryNameDisplay = this.countryNameResult;
				this.setFlagUrl(countryResult.data.country_code);
			});
	}
	
	// CALL COUNTRY NAME API
	callCountryNameAPI(): Observable<any> {
		return this.http.get("https://app.sportdataapi.com/api/v1/soccer/countries/" + this.countryId + "?apikey=" +  this.apiKey);
	}
	  
	// SET FLAG URL
	setFlagUrl(countryCodeLowerCase : string) {
		this.countryFlagUrlLink = "https://flagsapi.com/" + countryCodeLowerCase.toUpperCase() + "/shiny/64.png";
	}
	 
	// LOAD PLAYER DATA
	loadPlayerData(){
			this.callPlayerDataAPI().subscribe(playerDataResult => {
			
			if (playerDataResult.data.length == 0){
				this.noPlayerDataToDisplay = " : No Player Data Available";
				this.hideTable();
			};
			
			if (playerDataResult.data.length > 0) {
				this.noPlayerDataToDisplay = "";
				this.displayPlayerDataResult(playerDataResult.data);
			}

			});

	}
	 
	// CALL PLAYER DATA API
	callPlayerDataAPI(): Observable<any> {
		let playerDataAPIString : string = this.setPlayerDataAPIString();
		return this.http.get(playerDataAPIString);	
	}
	
	// SET PLAYER DATA API STRING
	setPlayerDataAPIString() : string{
		 if (this.minimumAge == null && this.maximumAge == null) {
			return "https://app.sportdataapi.com/api/v1/soccer/players?apikey=" + this.apiKey + "&country_id=" + this.countryId;
		 }
		 
		 if (this.minimumAge == null && this.maximumAge != null) {
			return "https://app.sportdataapi.com/api/v1/soccer/players?apikey=" + this.apiKey + "&country_id=" + this.countryId + "&max_age=" + this.maximumAge;
		 }
		 
		 if (this.minimumAge != null && this.maximumAge == null) {
			return "https://app.sportdataapi.com/api/v1/soccer/players?apikey=" + this.apiKey + "&country_id=" + this.countryId + "&min_age=" + this.minimumAge;
		 }
		 
		 if (this.minimumAge != null && this.maximumAge != null) {
			return "https://app.sportdataapi.com/api/v1/soccer/players?apikey=" + this.apiKey + "&country_id=" + this.countryId + "&min_age=" + this.minimumAge + "&max_age=" + this.maximumAge;
		 }
	 }
	 
	// DISPLAY PLAYER DATA RESULTS
	displayPlayerDataResult(players:string[]) {
		this.playersArray = players;
		this.showTable();
	 }
	 
	// SHOW TABLE
	showTable() {
		let table = document.getElementById("table");
		table.style.display = "block";
	}
	 
	// HIDE TABLE
	hideTable() {
		let table = document.getElementById("table");
		table.style.display = "none";
	}

}
