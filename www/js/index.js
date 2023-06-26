/*EXPERIENCESAMPLER LICENSE

The MIT License (MIT)

Copyright (c) 2014-2020 Sabrina Thai & Elizabeth Page-Gould
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/* activate localStorage */
var localStore = window.localStorage;

/* initialize notification permission request */
var permissions = cordova.plugins.permissions;

/* initialize firebase */
//**CHANGEME**//
var firebaseConfig = {
    apiKey: "AIzaSyAeZCaC7d5y0xqwQ_2iI2kBOND9yAKEKf4",
    authDomain: "socialselves.firebaseapp.com",
    projectId: "socialselves",
    storageBucket: "socialselves.appspot.com",
    messagingSenderId: "279784529433",
    appId: "1:279784529433:web:9fcfd4f03389fa259bd488",
    measurementId: "G-1KT23F2PRK" // For Firebase JS SDK v7.20.0 and later, measurementId is optional
};
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

/* surveyQuestion Model (This time, written in "JSON" format to interface more cleanly with Mustache) */
/* This is used to input the questions you would like to ask in your experience sampling questionnaire*/
var surveyQuestions = [
/*number each question in this variable starting from 0, so it is easy to reference question items when setting up question logic*/
                       /*0*/
					   /*survey initializer, to welcome participants back to the survey*/
					   {
						"type":"instructions",
						"variableName": "welcomeback",
						"questionPrompt": "Welcome back to the study! <br/><br/> You have completed<b> SURVEYCOUNT </b>out of 42 surveys so far during this phase of the study. <br/><br/>Please proceed to the survey if that looks correct. Otherwise, please contact us at crockett.laboratory@gmail.com."
					   },
					   /*1*/
                       /*snooze question, where selecting "No" snoozes the app for a predetermined amount of time*/
                       /*this is a multiple choice question*/
                       {
                       "type":"mult1",
                       "variableName": "snooze",
                       "questionPrompt": "Are you able to take the survey now?",
                       "minResponse": 0,
                       "maxResponse": 1,
                       "labels": [
                                {"label": "No"},
                                {"label": "Yes"},
                                ],
                       },
                       /*2*/
					   //Rating Self Questions - Instructions
					   {
					   "type":"instructions",
					   "variableName": "RateYourself_instructions",
					   "questionPrompt": "Thinking about your thoughts, feelings, and behavior <b>in the past hour</b>, please do your best to honestly evaluate yourself on the following traits.",
					   },
					   /*3*/
                       //Rating Self Questions (10 - randomize within this set)
                       {
                       "type":"mult1",
                       "variableName": "RateYourself_com",
                       "questionPrompt": "<b>How competent are you?</b> <br/><b>That is, how capable are you at doing things?</b>",
                       "minResponse": 1,
                       "maxResponse": 7,
                       "labels": [
                                {"label": "1 - Not at all competent"},
                                {"label": "2"},
                                {"label": "3"},
                                {"label": "4 - Neutral"},
                                {"label": "5"},
                                {"label": "6"},
                                {"label": "7 - Very competent"},
                                ]
                       },
                       /*4*/
                       /*a "mult1" question is for multiple choice questions and for Likert-scale items that only contain 
                       positive values (including 0). Below is what a multiple choice question would look like*/
                       {
                       "type":"mult1",
                       "variableName": "RateYourself_int",
                       "questionPrompt": "<b>How intelligent are you?</b> <br/><b>That is, how easily do you learn or understand new things or problems?</b>",
                       "minResponse": 1,
                       "maxResponse": 7,
                       "labels": [
                                {"label": "1 - Not at all intelligent"},
                                {"label": "2"},
                                {"label": "3"},
                                {"label": "4 - Neutral"},
                                {"label": "5"},
                                {"label": "6"},
                                {"label": "7 - Very intelligent"},
                                ]
                       },
                       /*5*/
                       {
                       "type":"mult1",
                       "variableName": "RateYourself_fri",
                       "questionPrompt": "<b>How friendly are you?</b> <br/><b>That is, how sociable and pleasant are you?</b>",
                       "minResponse": 1,
                       "maxResponse": 7,
                       "labels": [
                                {"label": "1 - Not at all friendly"},
                                {"label": "2"},
                                {"label": "3"},
                                {"label": "4 - Neutral"},
                                {"label": "5"},
                                {"label": "6"},
                                {"label": "7 - Very friendly"},
                                ]
                       },
                       /*6*/
                       {
                       "type":"mult1",
                       "variableName": "RateYourself_tru",
                       "questionPrompt": "<b>How trustworthy are you?</b> <br/><b>That is, how much can you be relied upon as honest and truthful?</b>",
                       "minResponse": 1,
                       "maxResponse": 7,
                       "labels": [
                                {"label": "1 - Not at all trustworthy"},
                                {"label": "2"},
                                {"label": "3"},
                                {"label": "4 - Neutral"},
                                {"label": "5"},
                                {"label": "6"},
                                {"label": "7 - Very trustworthy"},
                                ]
                       },
                       /*7*/
                       {
                       "type":"mult1",
                       "variableName": "RateYourself_att",
                       "questionPrompt": "<b>How attractive are you?</b> <br/><b>That is, how physically appealing do you look to people?</b>",
                       "minResponse": 1,
                       "maxResponse": 7,
                       "labels": [
                                {"label": "1 - Not at all attractive"},
                                {"label": "2"},
                                {"label": "3"},
                                {"label": "4 - Neutral"},
                                {"label": "5"},
                                {"label": "6"},
                                {"label": "7 - Very attractive"},
                                ]
                       },
                       /*8*/
                       {
                       "type":"mult1",
                       "variableName": "RateYourself_dom",
                       "questionPrompt": "<b>How dominant are you?</b> <br/><b>That is, how powerful, controlling, or commanding are you?</b>",
                       "minResponse": 1,
                       "maxResponse": 7,
                       "labels": [
                                {"label": "1 - Not at all dominant"},
                                {"label": "2"},
                                {"label": "3"},
                                {"label": "4 - Neutral"},
                                {"label": "5"},
                                {"label": "6"},
                                {"label": "7 - Very dominant"},
                                ]
                       },
                       /*9*/
                       // ask about whether alone or with others 
                       // then have display logic questions show 13,14 only if selected with others
                       {
                       "type":"mult1",
                       "variableName": "socialSituation1_AloneWithOther",
                       "questionPrompt": "Are you currently alone or with other people?",
                       "minResponse": 0,
                       "maxResponse": 1,
                       "labels": [
                                {"label": "I am alone"},
                                {"label": "I am with other people"},
                                ]
                       },
					   /*10*/
					   // questions related to the presence of other ppl begin here //
					   {
						"type":"mult1",
						"variableName": "socialSituation2_HowClose",
						"questionPrompt": "<b>In your current situation, how close are you to the people around you?</b><br><br>That is, to what extent are your relationships with the people around you characterized by deeply understanding each other, accepting and validating each other's natures, and striving to care for and promote each other's overall well-being?",
						"minResponse": 0,
						"maxResponse": 8,
						"labels": [
								 {"label": "1 - Not at all close"},
								 {"label": "2"},
								 {"label": "3"},
								 {"label": "4"},
								 {"label": "5 - Neutral"},
								 {"label": "6"},
								 {"label": "7"},
								 {"label": "8"},
								 {"label": "9 - Very close"},
								 ]
						},				   
                       /*11*/
					   {
						"type":"mult1",
						"variableName": "socialSituation3_HowManyM",
						"questionPrompt": "How many people with you are men?",
						"minResponse": 0,
						"maxResponse": 9,
						"labels": [
								 {"label": "0"},
								 {"label": "1"},
								 {"label": "2"},
								 {"label": "3"},
								 {"label": "4"},
								 {"label": "5"},
								 {"label": "6"},
								 {"label": "7"},
								 {"label": "8"},
								 {"label": "9+"},
								 ]
						},
                       /*12*/
                       {
						"type":"mult1",
						"variableName": "socialSituation4_HowManyF",
						"questionPrompt": "How many people with you are women?",
						"minResponse": 0,
						"maxResponse": 9,
						"labels": [
								 {"label": "0"},
								 {"label": "1"},
								 {"label": "2"},
								 {"label": "3"},
								 {"label": "4"},
								 {"label": "5"},
								 {"label": "6"},
								 {"label": "7"},
								 {"label": "8"},
								 {"label": "9+"},
								 ]
						},
						/*13*/ 
						// endorsement questions - with others
						// endorsement (general) - f
						{
							"type": "mult1",
							"variableName": "socialSituation5_Endorsement_general_OthersF",
							"questionPrompt": "Do you share the same views about <b>women in general</b> as the people around you <b>right now?</b><br><br>That is, do you agree or disagree with how they see women?",
							"minResponse": 1,
							"maxResponse": 7,
							"labels": [
								{"label": "1 - Strongly disagree"},
								{"label": "2 - Disagree"},
								{"label": "3 - Slightly disagree"},
								{"label": "4 - Neither agree nor disagree"},
								{"label": "5 - Slightly agree"},
								{"label": "6 - Agree"},
								{"label": "7 - Strongly agree"},
							]
						},
						/*14*/
						// endorsement (general) - m (wth others)
						{
							"type": "mult1",
							"variableName": "socialSituation5_Endorsement_general_OthersM",
							"questionPrompt": "Do you share the same views about <b>men in general</b> as the people around you <b>right now?</b><br><br>That is, do you agree or disagree with how they see men?",
							"minResponse": 1,
							"maxResponse": 7,
							"labels": [
								{"label": "1 - Strongly disagree"},
								{"label": "2 - Disagree"},
								{"label": "3 - Slightly disagree"},
								{"label": "4 - Neither agree nor disagree"},
								{"label": "5 - Slightly agree"},
								{"label": "6 - Agree"},
								{"label": "7 - Strongly agree"},
							]
						},
						/*15*/
						// endorsement (ideal) - f (With others)
						{
							"type": "mult1",
							"variableName": "socialSituation6_Endorsement_ideal_OthersF",
							"questionPrompt": "Do you share the same views about <b>the ideal woman</b> as the people around you <b>right now?</b><br><br>That is, do you agree or disagree with how they see the ideal woman?",
							"minResponse": 1,
							"maxResponse": 7,
							"labels": [
								{"label": "1 - Strongly disagree"},
								{"label": "2 - Disagree"},
								{"label": "3 - Slightly disagree"},
								{"label": "4 - Neither agree nor disagree"},
								{"label": "5 - Slightly agree"},
								{"label": "6 - Agree"},
								{"label": "7 - Strongly agree"},
							]
						},
						/*16*/
						// endorsement (ideal) - m (with others)
						{
							"type": "mult1",
							"variableName": "socialSituation6_Endorsement_ideal_OthersM",
							"questionPrompt": "Do you share the same views about <b>the ideal man</b> as the people around you <b>right now?</b><br><br>That is, do you agree or disagree with how they see the ideal man?",
							"minResponse": 1,
							"maxResponse": 7,
							"labels": [
								{"label": "1 - Strongly disagree"},
								{"label": "2 - Disagree"},
								{"label": "3 - Slightly disagree"},
								{"label": "4 - Neither agree nor disagree"},
								{"label": "5 - Slightly agree"},
								{"label": "6 - Agree"},
								{"label": "7 - Strongly agree"},
							]
						},
						// endorsement questions - alone
						/*17*/
						// endorsement (general) - f (alone)
						{
							"type": "mult1",
							"variableName": "socialSituation5_Endorsement_general_AloneF",
							"questionPrompt": "Do you share the same views about <b>women in general</b> as the people who were <b>most recently</b> around you?<br><br>That is, do you agree or disagree with how they see women?",
							"minResponse": 1,
							"maxResponse": 7,
							"labels": [
								{"label": "1 - Strongly disagree"},
								{"label": "2 - Disagree"},
								{"label": "3 - Slightly disagree"},
								{"label": "4 - Neither agree nor disagree"},
								{"label": "5 - Slightly agree"},
								{"label": "6 - Agree"},
								{"label": "7 - Strongly agree"},
							]
						},
						/*18*/
						// endorsement (general) - m (alone)
						{
							"type": "mult1",
							"variableName": "socialSituation5_Endorsement_general_AloneM",
							"questionPrompt": "Do you share the same views about <b>men in general</b> as the people who were <b>most recently</b> around you?<br><br>That is, do you agree or disagree with how they see men?",
							"minResponse": 1,
							"maxResponse": 7,
							"labels": [
								{"label": "1 - Strongly disagree"},
								{"label": "2 - Disagree"},
								{"label": "3 - Slightly disagree"},
								{"label": "4 - Neither agree nor disagree"},
								{"label": "5 - Slightly agree"},
								{"label": "6 - Agree"},
								{"label": "7 - Strongly agree"},
							]
						},
						/*19*/
						// endorsement (ideal) - f (alone)
						{
							"type": "mult1",
							"variableName": "socialSituation6_Endorsement_ideal_AloneF",
							"questionPrompt": "Do you share the same views about <b>the ideal woman</b> as the people who were <b>most recently</b> around you?<br><br>That is, do you agree or disagree with how they see the ideal woman?",
							"minResponse": 1,
							"maxResponse": 7,
							"labels": [
								{"label": "1 - Strongly disagree"},
								{"label": "2 - Disagree"},
								{"label": "3 - Slightly disagree"},
								{"label": "4 - Neither agree nor disagree"},
								{"label": "5 - Slightly agree"},
								{"label": "6 - Agree"},
								{"label": "7 - Strongly agree"},
							]
						},
						/*20*/
						// endorsement (ideal) - m
						{
							"type": "mult1",
							"variableName": "socialSituation6_Endorsement_ideal_AloneM",
							"questionPrompt": "Do you share the same views about <b>the ideal man</b> as the people who were <b>most recently</b> around you?<br><br>That is, do you agree or disagree with how they see the ideal man?",
							"minResponse": 1,
							"maxResponse": 7,
							"labels": [
								{"label": "1 - Strongly disagree"},
								{"label": "2 - Disagree"},
								{"label": "3 - Slightly disagree"},
								{"label": "4 - Neither agree nor disagree"},
								{"label": "5 - Slightly agree"},
								{"label": "6 - Agree"},
								{"label": "7 - Strongly agree"},
							]
						},
                       /*21*/
					   // this question is only asked if ppl are with others (f)
                       {
						"type":"mult1",
						"variableName": "socialSituation7_ThirdOrderSimilarity_ideal_OthersF",
						"questionPrompt": "Right now, do the people around you see you as similar to an <b>ideal woman?</b>",
						"minResponse": 1,
						"maxResponse": 7,
						"labels": [
								 {"label": "1 - People here do not see me as similar to an ideal woman at all"},
								 {"label": "2"},
								 {"label": "3"},
								 {"label": "4 - People here see me as somewhat similar to an ideal woman"},
								 {"label": "5"},
								 {"label": "6"},
								 {"label": "7 - People here see me as very similar to an ideal woman"},
								 ]
						},
					   /*22*/
					   // third order similarity to ideal (m)
					   {
						"type":"mult1",
						"variableName": "socialSituation7_ThirdOrderSimilarity_ideal_OthersM",
						"questionPrompt": "Right now, do the people around you see you as similar to an <b>ideal man?</b>",
						"minResponse": 1,
						"maxResponse": 7,
						"labels": [
								 {"label": "1 - People here do not see me as similar to an ideal man at all"},
								 {"label": "2"},
								 {"label": "3"},
								 {"label": "4 - People here see me as somewhat similar to an ideal man"},
								 {"label": "5"},
								 {"label": "6"},
								 {"label": "7 - People here see me as very similar to an ideal man"},
								 ]
						},
						/*23*/
						// third order similarity to general (f)
						{
							"type":"mult1",
							"variableName": "socialSituation8_ThirdOrderSimilarity_general_OthersF",
							"questionPrompt": "Right now, do the people around you see you as similar to <b>most other women?</b>",
							"minResponse": 1,
							"maxResponse": 7,
							"labels": [
									 {"label": "1 - People here do not see me as similar to other women at all"},
									 {"label": "2"},
									 {"label": "3"},
									 {"label": "4 - People here see me as somewhat similar to other women"},
									 {"label": "5"},
									 {"label": "6"},
									 {"label": "7 - People here see me as very similar to other women"},
									 ]
							},
						/*24*/
						// third order similarity to general (m)
						{
							"type":"mult1",
							"variableName": "socialSituation8_ThirdOrderSimilarity_general_OthersM",
							"questionPrompt": "Right now, do the people around you see you as similar to <b>most other men?</b>",
							"minResponse": 1,
							"maxResponse": 7,
							"labels": [
									 {"label": "1 - People here do not see me as similar to other men at all"},
									 {"label": "2"},
									 {"label": "3"},
									 {"label": "4 - People here see me as somewhat similar to other men"},
									 {"label": "5"},
									 {"label": "6"},
									 {"label": "7 - People here see me as very similar to other men"},
									 ]
							},
						// end of questions for participants who are with others
						// beginning of the list of questions that are asked when participants are alone
						/*25*/
						// third order similarity to ideal (f) but with recent people
						{
							"type":"mult1",
							"variableName": "socialSituation7_ThirdOrderSimilarity_ideal_AloneF",
							"questionPrompt": "Think of the people who were most recently around you. Do they see you as similar to an <b>ideal woman?</b>",
							"minResponse": 1,
							"maxResponse": 7,
							"labels": [
									 {"label": "1 - They do not see me as similar to an ideal woman at all"},
									 {"label": "2"},
									 {"label": "3"},
									 {"label": "4 - They see me as somewhat similar to an ideal woman"},
									 {"label": "5"},
									 {"label": "6"},
									 {"label": "7 - They see me as very similar to an ideal woman"},
									 ]
							},
						/*26*/
						// third order similarity to ideal (m) with recent people
						{
							"type":"mult1",
							"variableName": "socialSituation7_ThirdOrderSimilarity_ideal_AloneM",
							"questionPrompt": "Think of the people you were most recently with. Do they see you as similar to an <b>ideal man?</b>",
							"minResponse": 1,
							"maxResponse": 7,
							"labels": [
									 {"label": "1 - They do not see me as similar to an ideal man at all"},
									 {"label": "2"},
									 {"label": "3"},
									 {"label": "4 - They see me as somewhat similar to an ideal man"},
									 {"label": "5"},
									 {"label": "6"},
									 {"label": "7 - They see me as very similar to an ideal man"},
									 ]
							},
						/*27*/
						// third order similarity to general (f) with recent people
						{
							"type":"mult1",
							"variableName": "socialSituation8_ThirdOrderSimilarity_general_AloneF",
							"questionPrompt": "Think of the people you were most recently with. Do they see you as similar to <b>most other women?</b>",
							"minResponse": 1,
							"maxResponse": 7,
							"labels": [
									 {"label": "1 - They do not see me as similar to other women at all"},
									 {"label": "2"},
									 {"label": "3"},
									 {"label": "4 - They see me as somewhat similar to other women"},
									 {"label": "5"},
									 {"label": "6"},
									 {"label": "7 - They see me as very similar to other women"},
									 ]
							},
						/*28*/
						// third order similarity to general (m) with recent people
						{
							"type":"mult1",
							"variableName": "socialSituation8_ThirdOrderSimilarity_general_AloneM",
							"questionPrompt": "Think of the people you were most recently with. Do they see you as similar to <b>most other men?</b>",
							"minResponse": 1,
							"maxResponse": 7,
							"labels": [
									 {"label": "1 - They do not see me as similar to other men at all"},
									 {"label": "2"},
									 {"label": "3"},
									 {"label": "4 - They see me as somewhat similar to other men"},
									 {"label": "5"},
									 {"label": "6"},
									 {"label": "7 - They see me as very similar to other men"},
									 ]
							},
						/*29*/
						// first order similarity to ideal (f)
						{
							"type":"mult1",
							"variableName": "socialSituation9_FirstOrderSimilarity_ideal_F",
							"questionPrompt": "Right now, do you see yourself as similar to an <b>ideal woman?</b>",
							"minResponse": 1,
							"maxResponse": 7,
							"labels": [
									 {"label": "1 - I do not see myself as similar to an ideal woman at all"},
									 {"label": "2"},
									 {"label": "3"},
									 {"label": "4 - I see myself as somewhat similar to an ideal woman"},
									 {"label": "5"},
									 {"label": "6"},
									 {"label": "7 - I see myself as very similar to an ideal woman"},
									 ]
							},
						/*30*/
						// first order similarity to ideal (m)
						{
							"type":"mult1",
							"variableName": "socialSituation9_FirstOrderSimilarity_ideal_M",
							"questionPrompt": "Right now, do you see yourself as similar to an <b>ideal man?</b>",
							"minResponse": 1,
							"maxResponse": 7,
							"labels": [
									 {"label": "1 - I do not see myself as similar to an ideal man at all"},
									 {"label": "2"},
									 {"label": "3"},
									 {"label": "4 - I see myself as somewhat similar to an ideal man"},
									 {"label": "5"},
									 {"label": "6"},
									 {"label": "7 - I see myself as very similar to an ideal man"},
									 ]
							},
						/*31*/
						// first order similarity to women in general (f)
						{
							"type":"mult1",
							"variableName": "socialSituation10_FirstOrderSimilarity_general_F",
							"questionPrompt": "Right now, do you see yourself as similar to <b>most other women?</b>",
							"minResponse": 1,
							"maxResponse": 7,
							"labels": [
									 {"label": "1 - I do not see myself as similar to other women at all"},
									 {"label": "2"},
									 {"label": "3"},
									 {"label": "4 - I see myself as somewhat similar to other women"},
									 {"label": "5"},
									 {"label": "6"},
									 {"label": "7 - I see myself as very similar to other women"},
									 ]
							},
						/*32*/
						// first order similarity to men in general (m)
						{
							"type":"mult1",
							"variableName": "socialSituation10_FirstOrderSimilarity_general_M",
							"questionPrompt": "Right now, do you see yourself as similar to <b>most other men?</b>",
							"minResponse": 1,
							"maxResponse": 7,
							"labels": [
									 {"label": "1 - I do not see myself as similar to other men at all"},
									 {"label": "2"},
									 {"label": "3"},
									 {"label": "4 - I see myself as somewhat similar to other men"},
									 {"label": "5"},
									 {"label": "6"},
									 {"label": "7 - I see myself as very similar to other men"},
									 ]
							},
						// end of social situation questions

                       /*33*/
					   // beginning of well-being measures
                       {
                       "type":"mult1",
                       "variableName": "WellBeing1_Mood_Energy",
                       "questionPrompt": "Thinking about your <b>energy level</b> in the <b>past hour</b>, how do you feel?",
                       "minResponse": 1,
                       "maxResponse": 7,
                       "labels": [
                                {"label": "1 - Very sleepy"},
                                {"label": "2"},
                                {"label": "3"},
                                {"label": "4 - Neutral"},
                                {"label": "5"},
                                {"label": "6"},
                                {"label": "7 - Very alert"},
                                ]
                       },
                       /*34*/
                       {
                       "type":"mult1",
                       "variableName": "WellBeing2_Mood_Valence",
                       "questionPrompt": "Thinking about your <b>mood</b> in the <b>past hour</b>, how do you feel?",
                       "minResponse": 1,
                       "maxResponse": 7,
                       "labels": [
                                {"label": "1 - Very negative"},
                                {"label": "2"},
                                {"label": "3"},
                                {"label": "4 - Neutral"},
                                {"label": "5"},
                                {"label": "6"},
                                {"label": "7 - Very positive"},
                                ]
                       },
                       /*35*/
                       {
                       "type":"mult1",
                       "variableName": "WellBeing3_WellBeing",
                       "questionPrompt": "Taking everything into consideration, how well have you been doing in the <b>past hour</b>?",
                       "minResponse": 1,
                       "maxResponse": 7,
                       "labels": [
                                {"label": "Terrible"},
                                {"label": "Very poor"},
                                {"label": "Poor"},
                                {"label": "Fair"},
                                {"label": "Good"},
                                {"label": "Very good"},
                                {"label": "Excellent"},
                                ]
                       },
					   /*36*/
					   {
						"type":"mult1",
						"variableName": "WellBeing4_Anxiety",
						"questionPrompt": "Please rate to what extent the following words describe your current mood:<br><br><b>Anxious</b>",
						"minResponse": 1,
						"maxResponse": 7,
						"labels": [
								 {"label": "1 - Not at all anxious"},
								 {"label": "2"},
								 {"label": "3"},
								 {"label": "4 - Somewhat anxious"},
								 {"label": "5"},
								 {"label": "6"},
								 {"label": "7 - Very anxious"},
								 ]
						},
						/*37*/
						{
							"type":"mult1",
							"variableName": "WellBeing5_Sad",
							"questionPrompt": "Please rate to what extent the following words describe your current mood:<br><br><b>Sad</b>",
							"minResponse": 1,
							"maxResponse": 7,
							"labels": [
									 {"label": "1 - Not at all sad"},
									 {"label": "2"},
									 {"label": "3"},
									 {"label": "4 - Somewhat sad"},
									 {"label": "5"},
									 {"label": "6"},
									 {"label": "7 - Very sad"},
									 ]
							},
                       /*38*/
                       {
                       "type":"mult1",
                       "variableName": "WellBeing6_SelfEsteem",
                       "questionPrompt": "Thinking about yourself in the <b>past hour</b>, to what extent do you agree with this statement? <br/><br/><b>I have high self-esteem.</b>",
                       "minResponse": 1,
                       "maxResponse": 7,
                       "labels": [
                                {"label": "1 - Not very true of me"},
                                {"label": "2"},
                                {"label": "3"},
                                {"label": "4 - Neither true nor untrue of me"},
                                {"label": "5"},
                                {"label": "6"},
                                {"label": "7 - Very true of me"},
                                ]
                       },
                       // end of survey questions
                       // beginning of lockout messages 
                       // 39 
                       {
					   "type":"instructions",
					   "variableName": "studyHasntStarted",
					   "questionPrompt": "This study has not started yet. Please wait until you receive a notification before launching the app. ",
					   },  
					   // 40 <- was 36
					   {
					   "type":"instructions",
					   "variableName": "studyEnded",
					   "questionPrompt": "The study has now finished. You can now delete the app, but we would advise you to keep it until you have received your payment. ",
					   },					   
					   // 41 <- was 37
					   {
					   "type":"instructions",
					   "variableName": "noSurveyAvailable",
					   "questionPrompt": "It is not time for you to complete a survey now. Please wait until your next notification.<br/><br/>If you believe you received this message in error, please close the app completely (swipe the app up).",
					   },					                       
					];

/*These are the messages that are displayed at the end of the questionnaire*/
var lastPage = [
				/*0*/
                {
                "message": "Saving data..."
                },
                /*1*/
                {
                "message": "Snoozed! We will ask again later."
                },
                // 2
                {
                "message": "Thank you for your interest in our study. Unfortunately, our app is incompatible with your phone, so you CANNOT participate in our study. We apologize for the inconvenience. "
                },
                /*3*/
                {
                "message": "Please check back later. "                
                },
                /*4*/
                {
                "message": "The study has finished. "              
                },
                ];

/*Questions to set up participant notifications so that notifications are customized to participant's schedule*/                
var participantSetup = [
                        // -13
                        // created a new type of question so can validate the length of the survey. 
                        // one for inputting only 3 values
                        {
						"type":"idText3",
						"variableName": "id1",
						"minLength": 3, 
						"maxLength": 3,
						"questionPrompt": "📙<br><b>Survey Matcher</b><br/><br/><i>Enter your anonymous participant ID</i><br/><br/> This section allows us to match you with other data you provide us, while still making sure your responses remain completely anonymous and confidential. <br/><br/>Please write the <b>first three letters</b> of the first street you ever lived on (e.g., the first street I lived on was Essex Street, so I would enter 'ESS'):"
                        },
                        // -12
                        // make another new type of question so can validate length of response
                        // one of inputting 2 values
                        {
						"type":"idText2",
						"variableName": "id2",
						"minLength": 2, 
						"maxLength": 2,
						"questionPrompt": "Survey Matcher - Enter your anonymous participant ID <br/><br/> This section allows us to match you with other data you provide us, while still making sure your responses remain completely anonymous and confidential. <br/><br/>Please enter the <b>2-digit</b> calendar day of your birthday (e.g., I was born on December 1st, so I would enter '01'):"
                        },
                        // -11
                        {
						"type":"idText2",
						"variableName": "id3",
						"minLength": 2, 
						"maxLength": 2,
						"questionPrompt": "Survey Matcher - Enter your anonymous participant ID <br/><br/> This section allows us to match you with other data you provide us, while still making sure your responses remain completely anonymous and confidential. <br/><br/>Please enter the <b>last two letters</b> of your mother's maiden name (e.g., My mother's maiden name is Campbell, so I would enter 'LL'):"
                        },
                        // -10
                        {
						"type":"mult1",
						"variableName": "idConfirm",
						"questionPrompt": "Your ID is <br/><br/><b> PID </b> <br/><br/>Is this correct?",
						"minResponse":0,
                       	"maxResponse":1,
                       	"labels": [
                       		{"label":"No"},
                       		{"label":"Yes"}
                       	]
                        },
                        // -9
                        {
							"type":"mult1",
							"variableName": "ParGen",
							"questionPrompt": "Do you describe yourself as a man, a woman, or in some other way?",
							"minResponse":0,
							   "maxResponse":2,
							   "labels": [
								   {"label":"Man"},
								   {"label":"Woman"},
								   {"label":"Some other way"}
							   ]
							},
                        // -8
                        {
							"type":"mult1",
							"variableName": "ParGen2",
							"questionPrompt": "The rest of the survey will have questions asking about your impressions of men or women and how you personally relate to ideas of manhood and womanhood. Which version of the survey would you prefer to see?",
							"minResponse":0,
							"maxResponse":1,
							"labels": [
								{"label":"Man"},
								{"label":"Woman"},
							]
						},
                        // -7
                        {
                        "type":"mult1",
                       	"variableName":"osType",
                       	"questionPrompt":"What type of device do you have?",
                       	"minResponse":0,
                       	"maxResponse":1,
                       	"labels": [
                       		{"label":"iPhone or Other Apple Device"},
                       		{"label":"Android Phone or Android Device"}
                       	]
                        },
						// -6 (request permission)
						{
						"type":"mult1",
						"variableName": "requestNotificationPermission",
						"questionPrompt": "Next, we will request permission to send notifications to you.<br><br>Please click the button below to receive a <b>request to allow notifications</b>.",
						"minResponse": 1,
						"maxResponse": 1,
						"labels": [
							{"label": "Request permission to allow notifications"},
						]
						},
                        // -5  (test notifications)
                        {
                        "type":"mult1",
						"variableName": "testNotification",
						"questionPrompt": "Next, we will test whether the notification system is working on your phone. Please click the button below to test the notification system. <br/><br/> You will receive a notification in 10 seconds. <b>If you see the notification, DO NOT CLICK ON IT.</b> <i>Clicking on it will interrupt your app setup.</i> <br/><br/> Please return to the app after you have seen the notification or 10 seconds have passed. ",
						"minResponse": 1,
                       	"maxResponse": 1,
                       	"labels": [
                                {"label": "Test notification now - it should fire within 10 seconds"},
                        ]
                        },
                        // -4
                        {
                        "type":"mult1",
                       	"variableName":"notificationWorked",
                       	"questionPrompt":"Did you receive the test notification? (Please wait up to 10 seconds.)",
                       	"minResponse":0,
                       	"maxResponse":1,
                       	"labels": [
                       		{"label":"No"},
                       		{"label":"Yes"}
                       	]
                        },
                       // -3
                        {
                        "type":"instructions",
                       	"variableName":"notificationFail",
                       	"questionPrompt":"It looks like your notification system is not working. You are ineligible to participate in our study. <br/><br/> If you think that an error has occurred, please restart the setup process by clearing the storage & cache for this app on your phone, or by reinstalling the app. <br/><br/> For assistance, contact us at crockett.laboratory@gmail.com.",
                        },
                        // -2
						{
						"type":"timePicker",
						"variableName": "survey1Start",
						"questionPrompt": "We will now ask you to select two blocks of time when you expect to be <b>around other people but still have your phone with you</b> to complete the survey.<br/><br/>Please choose a time in the first half of your day when you'll be around people and have access to your phone for ~3 hours. <br/><br/>When does your <b>FIRST</b> block of time <b>START</b>?"
                        },
//                        // (-3)
//						{
//						"type":"timePicker",
//						"variableName": "survey1End",
//						"questionPrompt": "We will now ask you to select two blocks of time when you expect to be <b>around other people but still have your phone with you</b> to complete the survey. Please allow at least 2 hours for each block of time. <br/><br/>When does your <b>FIRST</b> block of time <b>END</b>? This should be at least 2 hours after the previous start time that you indicated."
//                        },
                        // -1
                        {
						"type":"timePicker2",
						"variableName": "survey2Start",
						"questionPrompt": "We will now ask you to select two blocks of time when you expect to be <b>around other people but still have your phone with you</b> to complete the survey.<br/><br/>Please choose a time in the second half of your day when you'll be around people and have access to your phone for ~3 hours. <br/><br/>When does your <b>SECOND</b> block of time <b>START</b>?"
                        },
//                        // (-1)
//						{
//						"type":"timePicker",
//						"variableName": "survey2End",
//						"questionPrompt": "We will now ask you to select two blocks of time when you expect to be <b>around other people but still have your phone with you</b> to complete the survey. Please allow at least 2 hours for each block of time. <br/><br/>When does your <b>SECOND</b> block of time <b>END</b>? This should be at least 2 hours after the previous start time that you indicated."
//                        },
//           
                    ];

/*Populate the view with data from surveyQuestion model*/
// Making mustache templates
//This line determines the number of questions in your participant setup
//Shout-out to Rebecca Grunberg for this great feature!
var NUMSETUPQS = participantSetup.length;
//This line tells ExperienceSampler which question in surveyQuestions is the snooze question
//If you choose not to use the snooze option, just comment it out
var SNOOZEQ = 1;
// This var tells ExperienceSampler how long each block of time should be, in HOURS (e.g., 3 hours)
var SURVEYBLOCKHOUR = 3;
//This section of code creates the templates for all the question formats
var questionTmpl = "<p>{{{questionText}}}</p><ul>{{{buttons}}}</ul>";
var questionTextTmpl = "{{{questionPrompt}}}";
var buttonTmpl = "<li><button id='{{id}}' value='{{value}}'>{{label}}</button></li>";
var textTmpl="<li><textarea cols=50 rows=5 id='{{id}}'></textarea></li><li><button type='submit' value='Enter'>Enter</button></li>";
var numberTmpl = "<li><input type='number' id='{{id}}'></input></li><br/><br/><li></li><li><button type='submit' value='Enter'>Enter</button></li>";
// Make a new template for participant id
var idText3Tmpl="<li><input type='text' id='{{id}}' required minlength='3' maxlength='3' size='24'></input></li><br/><br/><li></li><li><button type='submit' value='Enter'>Enter</button></li>";
var idText2Tmpl="<li><input type='text' id='{{id}}' required minlength='2' maxlength='2' size='24'></input></li><br/><br/><li></li><li><button type='submit' value='Enter'>Enter</button></li>";
var checkListTmpl="<li><input type='checkbox' id='{{id}}' value='{{value}}'>{{label}}</input></li>";
var instructionTmpl = "<li><button id='{{id}}' value = 'Next'>Next</button></li>";
var linkTmpl = "<li><button id='{{id}}' value = 'Next'>Click here AFTER finishing the survey in the link above</button></li>";
var sliderTmpl = "<li><input type='range' min='{{min}}' max='{{max}}' value='{{value}}' orient=vertical id='{{id}}' oninput='outputUpdate(value)'></input><output for='{{id}}' id='slider'>50</output><script>function outputUpdate(slidervalue){document.querySelector('#slider').value=slidervalue;}</script></li><li><button type='submit' value='Enter'>Enter</button></li>";
var datePickerTmpl = '<li><input id="{{id}}" data-format="DD-MM-YYYY" data-template="D MMM YYYY" name="date"><br /><br /></li><li><button type="submit" value="Enter">Enter</button></li><script>$(function(){$("input").combodate({firstItem: "name",minYear:2015, maxYear:2016});});</script>';
var dateAndTimePickerTmpl = '<li><input id="{{id}}" data-format="DD-MM-YYYY-HH-mm" data-template="D MMM YYYY  HH:mm" name="datetime24"><br /><br /></li><li><button type="submit" value="Enter">Enter</button></li><script>$(function(){$("input").combodate({firstItem: "name",minYear:2015, maxYear:2016});});</script>';
var timePickerTmpl = "<li><input id ='{{id}}' type='time'></input><br /><br /></li><li><button type='submit' value='Enter'>Enter</button></li>";
var lastPageTmpl = "<h3>{{message}}</h3>";
//This line generates the unique key variable. You will not assign the value here, because you want it the value to change
//with each new questionnaire
var uniqueKey;
// declare participant_id as a variable
var participant_id; 
// declare ParGen as a variable
var ParGen_MF;
// declare being alone or with others as a variable
var Alone_WithOthers;
// declare parts of the id as variables so you can join them together to form the participant_id
var id1, id2, id3; 
// indicate which questions need to be randomized in the rating about self block
var selfQs = [3, 4, 5, 6, 7, 8];
// indicate which questions need to be randomized in the social situation block (2 gender x 2 alone_withothers)
var socialSituationQsOtherF = [10, 11, 12, 13, 15, 21, 23, 29, 31]; // with others, for women
var socialSituationQsOtherM = [10, 11, 12, 14, 16, 22, 24, 30, 32]; // with others, men
var socialSituationQsAloneF = [17, 19, 25, 27, 29, 31]; // alone, for women
var socialSituationQsAloneM = [18, 20, 26, 28, 30, 32]; // alone, for men
// indicate which questions need to be randomized in the block of subjective well-being measures
var wellBeingQs = [33, 34, 35, 36, 37, 38];
// make a variable for each rating about self question to randomize
var self1, self2, self3, self4, self5, self6;
// make a variable for each social situation question to randomize
var socialSitOther1, socialSitOther2, socialSitOther3, socialSitOther4, socialSitOther5, socialSitOther6, socialSitOther7, socialSitOther8, socialSitOther9;
var socialSitAlone1, socialSitAlone2, socialSitAlone3, socialSitAlone4, socialSitAlone5, socialSitAlone6;
// make a variable for mood, well-being, identity questions to randomize
var wellBeing1, wellBeing2, wellBeing3, wellBeing4, wellBeing5, wellBeing6;
// declare values to store the start and end of the data collection period
var surveyStart, surveyEnd;
// create an array to store all the survey notifications
// we will use this check whether participants should be allowed to access the survey or not
var notifs = []; 
// declare how large the survey window is 
// 10800000 is 3 hours in milliseconds
// we'll use this to determine whether the participant should have access to the survey or not. 
var surveyWindow = 10800000;
// declare server variable
var server; 
//If you need to declare any other global variables (i.e., variables to be used in more than one function of ExperienceSampler)
//you should declare them here. 
//For example, you might declare your piped text variable or your question branch response variable
//var name /*sample piped text variable*/

var app = {
    // Application Constructor
initialize: function() {
    this.bindEvents();
},
    // Bind Event Listeners
bindEvents: function() {
    document.addEventListener("deviceready", this.onDeviceReady, false);
    document.addEventListener("resume", this.onResume, false);
    document.addEventListener("pause", this.onPause, false);
},
//these functions tell the app what to do at different stages of running
onDeviceReady: function() {
    app.init();
},

onResume: function() {app.sampleParticipant();},

onPause: function() {app.pauseEvents();},

//Beginning our app functions
/* The first function is used to specify how the app should display the various questions. You should note which questions 
should be displayed using which formats before customizing this function*/
renderQuestion: function(question_index) {
    //First load the correct question from the JSON database
	var question;
	if (question_index <= -1) {question = participantSetup[question_index + NUMSETUPQS];}
	else {
		question = surveyQuestions[question_index];
	}
    var questionPrompt = question.questionPrompt; 
    //If you want to include piped text in your question wording, you would implement it in this section. 
    //Below is an example of how you would look for the NAME placeholder in your surveyQuestion questionPrompts 
    //and replace it with the response value that you assign to the name variable
    //See our example app to see how you can implement this
	if (questionPrompt.indexOf('PID') >= 0) {
		questionPrompt = questionPrompt.replace("PID", function replacer() {return localStore.participant_id;});
	}
	if (questionPrompt.indexOf('SURVEYCOUNT') >= 0) {
		questionPrompt = questionPrompt.replace("SURVEYCOUNT", function replacer() {return parseInt(localStore.getItem("surveyCount")) || 0;});
	}
	Mustache.parse(questionTextTmpl);
	Mustache.compile(questionTextTmpl);
	question.questionText = Mustache.render(questionTextTmpl, {questionPrompt: questionPrompt}); 

    //Now populate the view for this question, depending on what the question type is
    //This part of the function will render different question formats depending on the type specified
    //Another shout-out to Rebecca Grunberg for this amazing improvement to ExperienceSampler
    switch (question.type) {
    	case 'mult1': // Rating scales (i.e., small numbers at the top of the screen and larger numbers at the bottom of the screen).
    		question.buttons = "";
        	var label_count = 0;
        	for (var i = question.minResponse; i <= question.maxResponse; i++) {
            	var label = question.labels[label_count++].label;
            	//If you want to implement piped text in your wording choice, you would place it here
    			//Below is an example of how you would look for the NAME placeholder in your surveyQuestion labels 
    			//and replace it with 
//                 if (label.indexOf('NAME') >= 0){
//             		label = label.replace("NAME", function replacer() {return name;});
//             		}            	
            	question.buttons += Mustache.render(buttonTmpl, {
                                                id: question.variableName+i,
                                                value: i,
                                                label: label
                                                });
        	}
        	$("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
        	$("#question ul li button").click(function(){
        		app.recordResponse(this, question_index, question.type);
        	});
        	break;
        case 'mult2': // Rating scales (i.e., positive numbers at the top of the screen and negative numbers at the bottom of the screen).
    		question.buttons = "";
            var label_count = 0;
            for (var j = question.maxResponse; j >= question.minResponse; j--) {
                var label = question.labels[label_count++].label;
//                if (label.indexOf('NAME') >= 0){
//            		label = label.replace("NAME", function replacer() {return name;});
//           		}
                question.buttons += Mustache.render(buttonTmpl, {
                                                    id: question.variableName+j,
                                                    value: j,
                                                    label: label
                                                    });
            }
        	$("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
        	$("#question ul li button").click(function(){
        		app.recordResponse(this, question_index, question.type);
        	});
        	break;		
        case 'checklist':  
        	question.buttons = "";
        	var label_count = 0;
        	var checkboxArray = [];
        	for (var i = question.minResponse; i <= question.maxResponse; i++) {
            	var label = question.labels[label_count++].label;
//            	if (label.indexOf('NAME') >= 0){
//            		label = label.replace("NAME", function replacer() {return name;});
//            		}
            	question.buttons += Mustache.render(checkListTmpl, {
                                                	id: question.variableName+i,
                                                	value: i,
                                                	label: label
                                                	});
        	}
        	question.buttons += "<li><button type='submit' value='Enter'>Enter</button></li>";
        	$("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
        	$("#question ul li button").click( function(){
                                          checkboxArray.push(question.variableName);
                                          $.each($("input[type=checkbox]:checked"), function(){checkboxArray.push($(this).val());});
                                          app.recordResponse(String(checkboxArray), question_index, question.type);
            });
            break;
        case 'slider':
        	question.buttons = Mustache.render(sliderTmpl, {id: question.variableName+"1"}, {min: question.minResponse}, {max: question.maxResponse}, {value: (question.maxResponse)/2});
        	$("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
        	var slider = [];
        	$("#question ul li button").click(function(){
        			slider.push(question.variableName);
        			slider.push($("input[type=range]").val());
        			app.recordResponse(String(slider), question_index, question.type);
        	});
        	break;
        case 'instructions':
			Mustache.parse(instructionTmpl);
			Mustache.compile(instructionTmpl);
        	question.buttons = Mustache.render(instructionTmpl, {id: question.variableName+"1"});
        	$("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
        	var instruction = [];
        	$("#question ul li button").click(function(){ 
        		instruction.push(question.variableName);
        		instruction.push($(this).val());
        		app.recordResponse(String(instruction), question_index, question.type);
        	});
        	break;
        case 'link':
        	question.buttons = Mustache.render(linkTmpl, {id: question.variableName+"1"});
        	$("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
        	var instruction = [];
        	$("#question ul li button").click(function(){ 
        		instruction.push(question.variableName);
        		instruction.push($(this).val());
        		app.recordResponse(String(instruction), question_index, question.type);
        	});
        	break; 
	case 'text': //default to open-ended text
        	question.buttons = Mustache.render(textTmpl, {id: question.variableName+"1"});
        	$("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
        	$("#question ul li button").click(function(){
				//If you want to force a response from your participants for 
				//open-ended questions, you should uncomment this portion of the code
// 				if (app.validateResponse($("textarea"))){
        		 	app.recordResponse($("textarea"), question_index, question.type);
//                 } 
//                 else {
//                     alert("Please enter something.");
//                 }
            });
            break;
        // add a new question type for participant id
		// this one is for 3 characters    
        case 'idText3': //default to open-ended text
        	question.buttons = Mustache.render(idText3Tmpl, {id: question.variableName+"1"});
        	$("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
        	$("#question ul li button").click(function(){
				//If you want to force a response from your participants for 
				//open-ended questions, you should uncomment this portion of the code
				if (app.validateId($("input"))){
        		 	app.recordResponse($("input"), question_index, question.type);
                } 
                else {
                    alert("You have entered your id incorrectly.");
                }
            });
            break;  
    	// add a new question for participant id 
    	// this one is for 2 characters  
        case 'idText2': //default to open-ended text
        	question.buttons = Mustache.render(idText2Tmpl, {id: question.variableName+"1"});
        	$("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
        	$("#question ul li button").click(function(){
				//If you want to force a response from your participants for 
				//open-ended questions, you should uncomment this portion of the code
				// this function makes sure it is only 2 characters
				if (app.validateId2($("input"))){
        		 	app.recordResponse($("input"), question_index, question.type);
                } 
                else {
                    alert("You have entered your id incorrectly.");
                }
            });
            break;    

        case 'number': //default to open-ended text
        	question.buttons = Mustache.render(numberTmpl, {id: question.variableName+"1"});
        	$("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
        	$("#question ul li button").click(function(){
				//If you want to force a response from your participants for 
				//open-ended questions, you should uncomment this portion of the code
				if (app.validateNumber($("input"))){
        		 	app.recordResponse($("input"), question_index, question.type);
                } 
                else {
                    alert("Please enter a number.");
                }
            });
            break;  		    
        case 'datePicker':
        	question.buttons = Mustache.render(datePickerTmpl, {id: question.variableName+"1"});
        	$("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
        	var date, dateSplit, variableName = [], dateArray = [];
        	$("#question ul li button").click(function(){
        		date = $("input").combodate('getValue');
        		dateArray.push(question.variableName);
        		dateArray.push(date);
        		app.recordResponse(String(dateArray), question_index, question.type);
        	});
        	break;    
        case 'dateAndTimePicker':
        	question.buttons = Mustache.render(dateAndTimePickerTmpl, {id: question.variableName+"1"});
        	$("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
        	var date, dateSplit, variableName = [], dateArray = [];
        	$("#question ul li button").click(function(){
        		date = $("input").combodate('getValue');
        		dateArray.push(question.variableName);
        		dateArray.push(date);
        		app.recordResponse(String(dateArray), question_index, question.type);
        	});
        	break;
        case 'timePicker':
        	question.buttons = Mustache.render(timePickerTmpl, {id: question.variableName+"1"});
        	$("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
        	var time, timeSplit, variableName = [], timeArray = [];
        	$("#question ul li button").click(function(){
				if (app.validateTime($("input"))){
					// these lines of code tell the app to record the first time (used to check if second time block is at least X hours after)
					//var survey1timevalidate;
					//survey1timevalidate = $("input").val;
					//survey1timevalidate = localStore.survey1timevalidate.split(":");
        		 	app.recordResponse($("input"), question_index, question.type);
                } 
                else {
                    alert("Please enter a time. Make sure it is earlier than 21:00 (9pm) in your timezone."); //**CHANGEME**/
                }
        	});
        	break;	
		case 'timePicker2':
			question.buttons = Mustache.render(timePickerTmpl, {id: question.variableName+"1"});
        	$("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
        	var time, timeSplit, variableName = [], timeArray = [];
			$("#question ul li button").click(function(){
				if (app.validateTime2($("input"))){
					app.recordResponse($("input"), question_index, question.type);
				}
				else { //**CHANGEME**//
					alert("Please enter a time that is at least 3 hours after the previous time that you picked.")
				}
			});
			break;        		                 
        }
    },
    
renderLastPage: function(pageData, question_index) {
	console.log("renderLastPage fired");
    $("#question").html(Mustache.render(lastPageTmpl, pageData));
	//This section should be implemented if you choose to use a snooze feature
	//It tells ExperienceSampler that if the participant has chosen to snooze the app,
	//the app should save a snooze value of 1 (this value will be used to reset the unique key, so that
	//this data is does not have the same unique key as the subsequent questionnaire)
    if ( question_index == SNOOZEQ ) {
        app.snoozeNotif();
        localStore.snoozed = 1;
        app.saveData();        
    }
    //If you choose to implement the snooze function, uncomment the else in the statement below
    else if ( question_index == -1) {
		app.saveDataInstallation();
    }
    else if ( question_index == 39 || question_index == 40 || question_index == 41) { //**CHANGEME *//
    	app.saveDataAndClear();   
    }
    //This part of the code says that if the participant has completed the entire questionnaire,
    //ExperienceSampler should create a completed tag for it.
    //This tag will be used to count the number of completed questionnaires participants have completed
    //at the end of each day
    //The time stamp created here will also be used to create an end time for your restructured data
    else {
    	var datestamp = new Date();
    	var year = datestamp.getFullYear(), month = datestamp.getMonth(), day=datestamp.getDate(), hours=datestamp.getHours(), minutes=datestamp.getMinutes(), seconds=datestamp.getSeconds(), milliseconds=datestamp.getMilliseconds();
    	localStore[uniqueKey + '.' + "completed" + "_" + "completedSurvey"  + "_" + year + "_" + month + "_" + day + "_" + hours + "_" + minutes + "_" + seconds + "_" + milliseconds] = 1;	
		localStore[uniqueKey + "_" + "endTime"  + "_" + year + "_" + month + "_" + day + "_" + hours + "_" + minutes + "_" + seconds + "_" + milliseconds] = datestamp;	
		var surveyCount = parseInt(localStore.getItem('surveyCount')) || 0;
		surveyCount++;
		localStore.setItem('surveyCount', surveyCount.toString());
		console.log(localStore.surveyCount);
    	app.saveDataLastPage();
    }
},

/* Initialize the whole thing */
init: function() {
	//First, we assign a value to the unique key when we initialize ExperienceSampler
// 	uniqueKey = new Date().getTime();
	var now = new Date().getTime(); 
	// alert("now is: "+now + "parseInt(now) is:"+parseInt(now));
	//The statement below states that if there is no participant id or if the participant id is left blank,
	//ExperienceSampler would present the participant set up questions
	if (localStore.participant_id === " " || !localStore.participant_id || localStore.participant_id == "undefined") {
		var surveyCount = parseInt(localStorage.getItem('surveyCount')) || 0; // store survey count; if value does not exist or cannot be parsed as a number, defaults to 0
		localStore.setItem('surveyCount', surveyCount.toString()); // localStorage can only store strings; convert this to a string
		app.renderQuestion(-NUMSETUPQS);
	}  
	//otherwise ExperienceSampler should just save the unique key and display the first question in survey questions  

	// the study has not started yet logic
	if (now < localStore.surveyStart){
		uniqueKey = new Date().getTime();
		localStore.uniqueKey = uniqueKey;
		app.renderQuestion(39);

	}
	else if (now > localStore.surveyEnd){
		uniqueKey = new Date().getTime();
		localStore.uniqueKey = uniqueKey;
		app.renderQuestion(40);
	}
	else {
		for (var j = 0; j < 42; j++){
			var notifArray = localStore.notifs.split(","); 
			console.log(notifArray);
			var start = parseInt(notifArray[j]); 
			//alert("start:"+start);
			var end = (parseInt(notifArray[j]) + parseInt(surveyWindow)); //*CHANGEME ADDED PARSEINT TO THIS SURVEYWINDOW*//
			//alert("surveywindow:"+parseInt(surveyWindow)+" and end: "+end);
			//alert("now: "+now+" and parseInt(now): "+parseInt(now));
			if (parseInt(now) > parseInt(start) && parseInt(now) < parseInt(end)){ //ADDED PARSEINT TO ALL OF THESE
					//alert("survey window logic works and survey fired");
					// set the survey id; this is the time they start the survey in epoch time
					// you can convert it into regular time by searching for the epoch converter on google (first hit)
					uniqueKey = new Date().getTime();
					// store the survey id so that all the responses get the same unique key in case participant leaves the app
					// in the middle of survey
					localStore.uniqueKey = uniqueKey;
					// also store this as the start time for the dataset
					var startTime = new Date(uniqueKey);
					// make a date stamp for the start time Response
					var syear = startTime.getFullYear(), smonth = startTime.getMonth(), sday=startTime.getDate(), shours=startTime.getHours(), sminutes=startTime.getMinutes(), sseconds=startTime.getSeconds(), smilliseconds=startTime.getMilliseconds();
					// write the start time to the local store and will be sent to the server later on to be written into the dataset
					localStore[uniqueKey + "_" + "startTime"  + "_" + syear + "_" + smonth + "_" + sday + "_" + shours + "_" + sminutes + "_" + sseconds + "_" + smilliseconds] = startTime;
	
					// set the randomized order of the self rating Qs
					console.log("randomizing");
					self1 = app.randomSelectQs(selfQs);
					self2 = app.randomSelectQs(selfQs);
					self3 = app.randomSelectQs(selfQs);
					self4 = app.randomSelectQs(selfQs);
					self5 = app.randomSelectQs(selfQs);
					self6 = app.randomSelectQs(selfQs);
					// set the randomized order of the social situation Qs, depending on participant gender
					var ParGen_MF = parseInt(localStore.getItem('ParGen_MF'));

					if (ParGen_MF == 1 || ParGen_MF == '1') { // if female
						socialSitOther1 = app.randomSelectQs(socialSituationQsOtherF);
						socialSitOther2 = app.randomSelectQs(socialSituationQsOtherF);
						socialSitOther3 = app.randomSelectQs(socialSituationQsOtherF);
						socialSitOther4 = app.randomSelectQs(socialSituationQsOtherF);
						socialSitOther5 = app.randomSelectQs(socialSituationQsOtherF);
						socialSitOther6 = app.randomSelectQs(socialSituationQsOtherF);
						socialSitOther7 = app.randomSelectQs(socialSituationQsOtherF);
						socialSitOther8 = app.randomSelectQs(socialSituationQsOtherF);
						socialSitOther9 = app.randomSelectQs(socialSituationQsOtherF);

						socialSitAlone1 = app.randomSelectQs(socialSituationQsAloneF);
						socialSitAlone2 = app.randomSelectQs(socialSituationQsAloneF);
						socialSitAlone3 = app.randomSelectQs(socialSituationQsAloneF);
						socialSitAlone4 = app.randomSelectQs(socialSituationQsAloneF);
						socialSitAlone5 = app.randomSelectQs(socialSituationQsAloneF);
						socialSitAlone6 = app.randomSelectQs(socialSituationQsAloneF);
						console.log("randomized F social sit qs")
					} else if (ParGen_MF == 0 || ParGen_MF == '0'){ // if male
						socialSitOther1 = app.randomSelectQs(socialSituationQsOtherM);
						socialSitOther2 = app.randomSelectQs(socialSituationQsOtherM);
						socialSitOther3 = app.randomSelectQs(socialSituationQsOtherM);
						socialSitOther4 = app.randomSelectQs(socialSituationQsOtherM);
						socialSitOther5 = app.randomSelectQs(socialSituationQsOtherM);
						socialSitOther6 = app.randomSelectQs(socialSituationQsOtherM);
						socialSitOther7 = app.randomSelectQs(socialSituationQsOtherM);
						socialSitOther8 = app.randomSelectQs(socialSituationQsOtherM);
						socialSitOther9 = app.randomSelectQs(socialSituationQsOtherM);
						
						socialSitAlone1 = app.randomSelectQs(socialSituationQsAloneM);
						socialSitAlone2 = app.randomSelectQs(socialSituationQsAloneM);
						socialSitAlone3 = app.randomSelectQs(socialSituationQsAloneM);
						socialSitAlone4 = app.randomSelectQs(socialSituationQsAloneM);
						socialSitAlone5 = app.randomSelectQs(socialSituationQsAloneM);
						socialSitAlone6 = app.randomSelectQs(socialSituationQsAloneM);
						console.log("randomized M social sit qs")
					}
					localStore.setItem('ParGen_MF', ParGen_MF.toString());
		
					// set the randomized order of the mood/well-being Qs
					wellBeing1 = app.randomSelectQs(wellBeingQs); 
					wellBeing2 = app.randomSelectQs(wellBeingQs);
					wellBeing3 = app.randomSelectQs(wellBeingQs);
					wellBeing4 = app.randomSelectQs(wellBeingQs);
					wellBeing5 = app.randomSelectQs(wellBeingQs);
					wellBeing6 = app.randomSelectQs(wellBeingQs);
					// then show the snooze question to initiate the survey
					app.renderQuestion(0);
					break;
				} 
			// no survey available logic
			else {
				uniqueKey = new Date().getTime();
				localStore.uniqueKey = uniqueKey;
				app.renderQuestion(41);
			}	
		}
    }
   
    localStore.snoozed = 0;
},
  
/* Record User Responses */  
recordResponse: function(button, count, type) {
		//uncomment up to "localStore[uniqueRecord] = response;" to test whether app is recording and sending data correctly (Stage 2 of Customization)
		//This tells ExperienceSampler how to save data from the various formats
    //Record date (create new date object)
    var datestamp = new Date();
    var year = datestamp.getFullYear(), month = datestamp.getMonth(), day=datestamp.getDate(), hours=datestamp.getHours(), minutes=datestamp.getMinutes(), seconds=datestamp.getSeconds(), milliseconds=datestamp.getMilliseconds();
    //Record value of text field
    var response, currentQuestion, uniqueRecord;
    if (type == 'text') {
        response = button.val();
        // remove newlines from user input
        response = response.replace(/(\r\n|\n|\r)/g, ""); //encodeURIComponent(); decodeURIComponent()
        currentQuestion = button.attr('id').slice(0,-1);
    }
    else if (type == 'number') {
        response = button.val();
        // remove newlines from user input
        response = response.replace(/(\r\n|\n|\r)/g, ""); //encodeURIComponent(); decodeURIComponent()
        currentQuestion = button.attr('id').slice(0,-1);
    }        	
    // add this to tell the app what to record for these new id question types
	else if (type == 'idText3') {
        response = button.val();
        // remove newlines from user input
        response = response.replace(/(\r\n|\n|\r)/g, ""); //encodeURIComponent(); decodeURIComponent()
        currentQuestion = button.attr('id').slice(0,-1);
    }  
    // add this to tell the app what to record for these new id question types  	
	else if (type == 'idText2') {
        response = button.val();
        // remove newlines from user input
        response = response.replace(/(\r\n|\n|\r)/g, ""); //encodeURIComponent(); decodeURIComponent()
        currentQuestion = button.attr('id').slice(0,-1);
    }        	

    else if (type == 'slider') {
    	response = button.split(/,(.+)/)[1];
        currentQuestion = button.split(",",1);
    }
    //Record the array
    else if (type == 'checklist') {
        response = button.split(/,(.+)/)[1];
        currentQuestion = button.split(",",1);
    }
    else if (type == 'instructions') {
    	response = button.split(/,(.+)/)[1];
        currentQuestion = button.split(",",1);
    }
    //Record value of clicked button
    else if (type == 'mult1') {
        response = button.value;
        //Create a unique identifier for this response
        currentQuestion = button.id.slice(0,-1);
    }
    //Record value of clicked button
    else if (type == 'mult2') {
        response = button.value;
        //Create a unique identifier for this response
        currentQuestion = button.id.slice(0,-1);
    }
    else if (type == 'datePicker') {
		response = button.split(/,(.+)/)[1];
     	currentQuestion = button.split(",",1);
    }
    else if (type == 'dateAndTimePicker') {
		response = button.split(/,(.+)/)[1];
     	currentQuestion = button.split(",",1);
    }
    else if (type == 'timePicker') {
    	response = button.val();
        currentQuestion = button.attr('id').slice(0,-1);
    }
	else if (type == 'timePicker2') {
    	response = button.val();
        currentQuestion = button.attr('id').slice(0,-1);
    }
    if (count <= -1) {uniqueRecord = currentQuestion}
    else {uniqueRecord = uniqueKey + "_" + currentQuestion + "_" + year + "_" + month + "_" + day + "_" + hours + "_" + minutes + "_" + seconds + "_" + milliseconds;}
    //Save this to local storage
    localStore[uniqueRecord] = response;
	


	/*Question Logic Statements*/
// 		Stage 3 of Customization
		//if your questionnaire has two branches based on the absence or presence of a phenomenon, you will need the next statement
		//this statement allows you to record whether the phenomenon was absent or present so you can specify which branch the participant should complete when
		//the questionnaire splits into the two branches
		//if not then you do not need the next statement and should leave it commented out
    if (count == -13) {id1 = response;}
    if (count == -12) {id2 = response;}
    if (count == -11) {
    	id3 = response; 
    	participant_id = String(id1);
    	participant_id += String(id2);
    	participant_id += String(id3);
    	localStore.participant_id = participant_id; 
    }
	if (count == -9 && response < 2) { // record participant's self-identified gender
		ParGen_MF = response;
		localStore.ParGen_MF = String(ParGen_MF);
	}
	if (count == -8) { // record participant's preference for survey gender
		ParGen_MF = response;
		localStore.ParGen_MF = String(ParGen_MF);
	}
    
	//The line below states that if the app is on the last question of participant setup, it should schedule all the notifications
	//then display the default end of survey message, and then record which notifications have been scheduled.
	//You will test local notifications in Stage 4 of customizing the app
// 	********IF YOU HAVE NO QUESTION LOGIC BUT HAVE SCHEDULED NOTIFICATIONS, YOU NEED TO UNCOMMENT THE FOLLOWING LINE
// 	TO EXECUTE THE  () FUNCTION********
	// ask them to confirm if ID is correct. If ID is not correct, go back to the beginning
    if (count == -10 && response == 0){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(-13);});}
    // if ID is correct, keep going up with setup
    else if (count == -10 && response == 1){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(-9);});}
	// if participant identifies as a man or a woman, keep going with setup
	else if (count == -9 && response < 2){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(-7);});}
	// if participant identifies as some other way, ask which set of questions they would rather see
	else if (count == -9 && response == 2){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(-8);});}
    // on the request notification permission question, need to request permission to send notifications and then proceed to next question
	else if (count == -6){app.requestNotifPerm(); $("#question").fadeOut(400, function() {$("question").html("");app.renderQuestion(-5);});}
	// on the test notification question, need to schedule the test notification to fire and then proceed to the next question
	else if (count == -5){app.testNotif(); $("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(-4);});}
	// if the test notification did not fire, then show them question about how it did not fire (-5)
	else if (count == -4 && response == 0){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(-3);});}
	// if the test notification did fire, go to the survey time questions
	else if (count == -4 && response == 1){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(-2);});}
    // if notification failed, then show them last page message related to app being incompatible with phone
    else if (count == -3) {app.renderLastPage(lastPage[2], count);}
	// on the last survey question, schedule the notifications and then show them the last page
    else if (count == -1){
    	// randomly assign the server number at the end of setup
    	localStore.server = Math.floor(Math.random()*4)+1;
    	server = localStore.server; 
    	// schedule the notifications
    	app.scheduleNotifs();
    	// show the end of page message for set up
    	app.renderLastPage(lastPage[0], count);
	}
    // go to snooze last page message if they say not available to do survey now
    else if (count == SNOOZEQ && response == 0) {app.renderLastPage(lastPage[1], count);}

    // show self ratings questions in randomized order
    // because it's randomized we have to tell it to show the next question in the random order 
    // instead of relying on the second last line in this function to just show the next question
    else if (count == SNOOZEQ && response == 1){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(2);});}
	else if (count == 2){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(self1);}); console.log('self1')}
    else if (count == self1){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(self2);});}
    else if (count == self2){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(self3);});}
    else if (count == self3){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(self4);});}
    else if (count == self4){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(self5);});}
    else if (count == self5){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(self6);});}

    // last question in self ratings set should go to question 9 (social context - alone or with others)
    else if (count == self6){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(9);});}

	// logic for social situation
	// if participant says they are alone, go to next social situation question for those who are alone
	else if (count == 9 && response == 0){Alone_WithOthers = response; $("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(socialSitAlone1);});}
	// if participant says they are with other people, go to randomized social situation questions with people
	else if (count == 9 && response == 1){Alone_WithOthers = response; $("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(socialSitOther1);});}
	
	else if (count == socialSitAlone1 && Alone_WithOthers == 0){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(socialSitAlone2);});}
	else if (count == socialSitAlone2 && Alone_WithOthers == 0){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(socialSitAlone3);});}
	else if (count == socialSitAlone3 && Alone_WithOthers == 0){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(socialSitAlone4);});}
	else if (count == socialSitAlone4 && Alone_WithOthers == 0){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(socialSitAlone5);});}
	else if (count == socialSitAlone5 && Alone_WithOthers == 0){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(socialSitAlone6);});}
	
	else if (count == socialSitOther1 && Alone_WithOthers == 1){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(socialSitOther2);});}
	else if (count == socialSitOther2 && Alone_WithOthers == 1){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(socialSitOther3);});}
	else if (count == socialSitOther3 && Alone_WithOthers == 1){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(socialSitOther4);});}
	else if (count == socialSitOther4 && Alone_WithOthers == 1){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(socialSitOther5);});}
	else if (count == socialSitOther5 && Alone_WithOthers == 1){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(socialSitOther6);});}
	else if (count == socialSitOther6 && Alone_WithOthers == 1){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(socialSitOther7);});}
	else if (count == socialSitOther7 && Alone_WithOthers == 1){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(socialSitOther8);});}
	else if (count == socialSitOther8 && Alone_WithOthers == 1){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(socialSitOther9);});}

	// after these social situation questions, we want to go to the next set of randomized questions
	// depending on whether participant is alone or with someone, advance to next set of questions
	else if (count == socialSitAlone6 && Alone_WithOthers == 0){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(wellBeing1);});}
	else if (count == socialSitOther9 && Alone_WithOthers == 1){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(wellBeing1);});}

	// show general mood and well-being questions in a randomized order
	// because it's randomized we have to tell it to show the next question in the random order
	// instead of relying on the second last line in this function to just show the next question
	else if (count == wellBeing1){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(wellBeing2);});}
	else if (count == wellBeing2){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(wellBeing3);});}
	else if (count == wellBeing3){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(wellBeing4);});}
	else if (count == wellBeing4){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(wellBeing5);});}
	else if (count == wellBeing5){$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(wellBeing6);});}
	else if (count == wellBeing6){app.renderLastPage(lastPage[0], count);}

	// show lockout messages
	// the study hasn't started yet
	else if (count == 39){app.renderLastPage(lastPage[3], count);}
	// the study is over
	else if (count == 40){app.renderLastPage(lastPage[4], count);}
	// there is no survey currently available
	else if (count == 41){
		app.renderLastPage(lastPage[3], count);}


	//Uncomment the "/*else*/" below only when customizing question logic (Stage 3), so that the app will just proceed to the next question in the JSON database
	//DO NOT uncomment the "/*else*/" below when testing whether questions are being displayed in the right format (Stage 1) OR if you have no question logic 
	//in your questionnaire **CHECKTHIS**
   else if (count < surveyQuestions.length-1) {
	$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(count+1);});}
   else {
	app.renderLastPage(lastPage[0], count);}; //**CHANGEME** TRIED TO COMMENT THIS OUT */
},
    
/* Prepare for Resume and Store Data */
/* Time stamps the current moment to determine how to resume */
pauseEvents: function() {
    localStore.pause_time = new Date().getTime();
    localStore.uniqueKey = uniqueKey;	
    app.saveData();
},
      
sampleParticipant: function() {
	var now = new Date().getTime(); 
    var current_moment = new Date();
    var current_time = current_moment.getTime();
    //change X to the amount of time the participant is locked out of the app for in milliseconds
    //e.g., if you want to lock the participant out of the app for 10 minutes, replace X with 600000
    //If you don't have a snooze feature, remove the "|| localStore.snoozed == 1"
    if ((current_time - localStore.pause_time) > 600000 || localStore.snoozed == 1) {
        // the study has not started yet logic
		if (now < localStore.surveyStart){
			uniqueKey = new Date().getTime();
			localStore.uniqueKey = uniqueKey;
			app.renderQuestion(39);

		}
		else if (now > localStore.surveyEnd){
			uniqueKey = new Date().getTime();
			localStore.uniqueKey = uniqueKey;
			app.renderQuestion(40);
		}
		else {
			for (var j = 0; j < 42; j++){
				var notifArray = localStore.notifs.split(","); 
				console.log(notifArray);
				var start = parseInt(notifArray[j]); 
				//alert("start:"+start);
				var end = (parseInt(notifArray[j]) + parseInt(surveyWindow)); //*CHANGEME ADDED PARSEINT TO THIS SURVEYWINDOW*//
				//alert("surveywindow:"+parseInt(surveyWindow)+" and end: "+end);
				//alert("now: "+now+" and parseInt(now): "+parseInt(now));
				if (now > start && now < end){
					// set the survey id; this is the time they start the survey in epoch time
					// you can convert it into regular time by searching for the epoch converter on google (first hit)
					uniqueKey = new Date().getTime();
					// store the survey id so that all the responses get the same unique key in case participant leaves the app
					// in the middle of survey
					localStore.uniqueKey = uniqueKey;
					// also store this as the start time for the dataset
					var startTime = new Date(uniqueKey);
					// make a date stamp for the start time Response
					var syear = startTime.getFullYear(), smonth = startTime.getMonth(), sday=startTime.getDate(), shours=startTime.getHours(), sminutes=startTime.getMinutes(), sseconds=startTime.getSeconds(), smilliseconds=startTime.getMilliseconds();
					// write the start time to the local store and will be sent to the server later on to be written into the dataset
					localStore[uniqueKey + "_" + "startTime"  + "_" + syear + "_" + smonth + "_" + sday + "_" + shours + "_" + sminutes + "_" + sseconds + "_" + smilliseconds] = startTime; 		
	
					// set the randomized order of the self rating Qs
					console.log("randomizing");
					self1 = app.randomSelectQs(selfQs);
					self2 = app.randomSelectQs(selfQs);
					self3 = app.randomSelectQs(selfQs);
					self4 = app.randomSelectQs(selfQs);
					self5 = app.randomSelectQs(selfQs);
					self6 = app.randomSelectQs(selfQs);
					// set the randomized order of the social situation Qs, depending on participant gender
					var ParGen_MF = parseInt(localStore.getItem('ParGen_MF'));
					if (ParGen_MF == 1 || ParGen_MF == '1') { // if female
						socialSitOther1 = app.randomSelectQs(socialSituationQsOtherF);
						socialSitOther2 = app.randomSelectQs(socialSituationQsOtherF);
						socialSitOther3 = app.randomSelectQs(socialSituationQsOtherF);
						socialSitOther4 = app.randomSelectQs(socialSituationQsOtherF);
						socialSitOther5 = app.randomSelectQs(socialSituationQsOtherF);
						socialSitOther6 = app.randomSelectQs(socialSituationQsOtherF);
						socialSitOther7 = app.randomSelectQs(socialSituationQsOtherF);
						socialSitOther8 = app.randomSelectQs(socialSituationQsOtherF);
						socialSitOther9 = app.randomSelectQs(socialSituationQsOtherF);

						socialSitAlone1 = app.randomSelectQs(socialSituationQsAloneF);
						socialSitAlone2 = app.randomSelectQs(socialSituationQsAloneF);
						socialSitAlone3 = app.randomSelectQs(socialSituationQsAloneF);
						socialSitAlone4 = app.randomSelectQs(socialSituationQsAloneF);
						socialSitAlone5 = app.randomSelectQs(socialSituationQsAloneF);
						socialSitAlone6 = app.randomSelectQs(socialSituationQsAloneF);
						console.log("randomized F social sit qs")
					} else if (ParGen_MF == 0 || ParGen_MF == '0'){ // if male
						socialSitOther1 = app.randomSelectQs(socialSituationQsOtherM);
						socialSitOther2 = app.randomSelectQs(socialSituationQsOtherM);
						socialSitOther3 = app.randomSelectQs(socialSituationQsOtherM);
						socialSitOther4 = app.randomSelectQs(socialSituationQsOtherM);
						socialSitOther5 = app.randomSelectQs(socialSituationQsOtherM);
						socialSitOther6 = app.randomSelectQs(socialSituationQsOtherM);
						socialSitOther7 = app.randomSelectQs(socialSituationQsOtherM);
						socialSitOther8 = app.randomSelectQs(socialSituationQsOtherM);
						socialSitOther9 = app.randomSelectQs(socialSituationQsOtherM);

						socialSitAlone1 = app.randomSelectQs(socialSituationQsAloneM);
						socialSitAlone2 = app.randomSelectQs(socialSituationQsAloneM);
						socialSitAlone3 = app.randomSelectQs(socialSituationQsAloneM);
						socialSitAlone4 = app.randomSelectQs(socialSituationQsAloneM);
						socialSitAlone5 = app.randomSelectQs(socialSituationQsAloneM);
						socialSitAlone6 = app.randomSelectQs(socialSituationQsAloneM);
						console.log("randomized M social sit qs")
					}
					localStore.setItem('ParGen_MF', ParGen_MF.toString());

					// set the randomized order of the mood/well-being Qs
					wellBeing1 = app.randomSelectQs(wellBeingQs); 
					wellBeing2 = app.randomSelectQs(wellBeingQs);
					wellBeing3 = app.randomSelectQs(wellBeingQs);
					wellBeing4 = app.randomSelectQs(wellBeingQs);
					wellBeing5 = app.randomSelectQs(wellBeingQs);
					wellBeing6 = app.randomSelectQs(wellBeingQs);
					// then show the snooze question to initiate the survey
					app.renderQuestion(0);
					console.log("survey initiated")
					break;
				} 
				// no survey available logic
				else {
					uniqueKey = new Date().getTime();
					localStore.uniqueKey = uniqueKey;
					app.renderQuestion(41);
				}	
			}
		}
    }
    
    else {
    	uniqueKey = localStore.uniqueKey;
    }
    app.saveData();
},

//uncomment this function to test data saving function (Stage 2 of Customization)
saveDataInstallation:function() {
//	server 1 - https://script.google.com/macros/s/AKfycbzZMUoc-kZXKCqki6yPaG5cKmc4Bwbl6bka3Rdci97YFc7FXP7SMxAJEzlX8jPzH6Vk/exec
//	server 2 - https://script.google.com/macros/s/AKfycbxMl2sax2uLj9dk_1aHLcRUseAmi5kRoD3CghrNjbTBFDP5asQCqqt3ff-QeRqv21eYaQ/exec
// 	server 3 - https://script.google.com/macros/s/AKfycbyX2Jx6vNg6W-cv2L6XjSuL95PaH0yu1ebANwr8_8RC1Uky-zG7LTAhdNYH3hSILGCkVw/exec
//	server 4 - https://script.google.com/macros/s/AKfycby1TM5fXJZPujK5aKYnq8Sr2OMQugCqH4pxAXOupswsukWGviAowmVDNdZ0e7huJBcn/exec
	var storage = JSON.stringify(localStore);
	var storage_save=JSON.parse(storage);
	/* write data to firebase */
	db.collection("experiencesampling1_alldata").add(storage_save);

	/* write data to google sheets */
	if (localStore.server == 1){
	    $.ajax({
           type: 'post',
           url: 'https://script.google.com/macros/s/AKfycbzZMUoc-kZXKCqki6yPaG5cKmc4Bwbl6bka3Rdci97YFc7FXP7SMxAJEzlX8jPzH6Vk/exec',
           data: storage_save,
           crossDomain: true,
           success: function (result) {
			var pid = localStore.participant_id; 
			var snoozed = localStore.snoozed; 
			var uniqueKey = localStore.uniqueKey; 
			var pause_time=localStore.pause_time;
			var notifs = localStore.notifs; 
			var surveyStart = localStore.surveyStart;
			var surveyEnd = localStore.surveyEnd;
			var server = localStore.server; 
			var surveyCount = localStore.surveyCount;
			var ParGen_MF = localStore.ParGen_MF;
	        localStore.clear();
	        localStore.participant_id = pid;
	        localStore.snoozed = snoozed;
			localStore.uniqueKey = uniqueKey;
			localStore.pause_time = pause_time;
			localStore.notifs = notifs;
			localStore.surveyStart = surveyStart; 
			localStore.surveyEnd = surveyEnd; 
			localStore.server = server; 
			localStore.surveyCount = surveyCount;
			localStore.ParGen_MF = ParGen_MF;
           	$("#question").html("<h3>Your responses have been recorded. Thank you for completing this survey. <br/><br/>Please make sure notifications for the app are turned on. <br /><br/> Please close the app completely to ensure you will receive your next notifications (Swipe the app up). <br /><br />You can now close the app. </h3>");
           },
           complete: function(data){
           	console.log("completed");
           	},
           	error: function (request, textStatus, errorThrown) {
           		if (textStatus === "timeout"){
					$("#question").html("<h3>It looks like the server is currently overloaded. Please try resending your data later. Click on the button below, and we'll remind you in 30 minutes to try sending your data again. If problems persist, please contact the researchers.</h3><br><button>Set Data Sending Reminder</button>");
					$("#question button").click(function () {app.dataSendingNotif();localStore.snoozed=2;console.log("localStore.snoozed is " + localStore.snoozed);});
				}
				else {
					var response = JSON.stringify(request);
					console.log("request is " + response);
					$("#question").html("<h3>Please try resending data. If problems persist, please contact the researchers.</h3><br><button>Resend data</button>");
					$("#question button").click(function () {app.saveDataLastPage();});
				}
			}
     	});
	}
	if (localStore.server == 2){
	    $.ajax({
           type: 'post',
           url: 'https://script.google.com/macros/s/AKfycbxMl2sax2uLj9dk_1aHLcRUseAmi5kRoD3CghrNjbTBFDP5asQCqqt3ff-QeRqv21eYaQ/exec',
           data: storage_save,
           crossDomain: true,
           success: function (result) {
			var pid = localStore.participant_id; 
			var snoozed = localStore.snoozed; 
			var uniqueKey = localStore.uniqueKey; 
			var pause_time=localStore.pause_time;
			var notifs = localStore.notifs; 
			var surveyStart = localStore.surveyStart;
			var surveyEnd = localStore.surveyEnd;
			var server = localStore.server; 
			var surveyCount = localStore.surveyCount;
			var ParGen_MF = localStore.ParGen_MF;
	        localStore.clear();
	        localStore.participant_id = pid;
	        localStore.snoozed = snoozed;
			localStore.uniqueKey = uniqueKey;
			localStore.pause_time = pause_time;
			localStore.notifs = notifs;
			localStore.surveyStart = surveyStart; 
			localStore.surveyEnd = surveyEnd; 
			localStore.server = server; 
			localStore.surveyCount = surveyCount;
			localStore.ParGen_MF = ParGen_MF;
           	$("#question").html("<h3>Your responses have been recorded. Thank you for completing this survey. <br/><br/> Please make sure notifications for the app are turned on. <br /><br/> Please close the app completely to ensure you will receive your next notifications (Swipe the app up). <br /><br />You can now close the app. </h3>");
           },
           complete: function(data){
           	console.log("completed");
           	},
           	error: function (request, textStatus, errorThrown) {
           		if (textStatus === "timeout"){
					$("#question").html("<h3>It looks like the server is currently overloaded. Please try resending your data later. Click on the button below, and we'll remind you in 30 minutes to try sending your data again. If problems persist, please contact the researchers.</h3><br><button>Set Data Sending Reminder</button>");
					$("#question button").click(function () {app.dataSendingNotif();localStore.snoozed=2;console.log("localStore.snoozed is " + localStore.snoozed);});
				}
				else {
					var response = JSON.stringify(request);
					console.log("request is " + response);
					$("#question").html("<h3>Please try resending data. If problems persist, please contact the researchers.</h3><br><button>Resend data</button>");
					$("#question button").click(function () {app.saveDataLastPage();});
				}
			}
     	});
	}
	if (localStore.server == 3){
	    $.ajax({
           type: 'post',
           url: 'https://script.google.com/macros/s/AKfycbyX2Jx6vNg6W-cv2L6XjSuL95PaH0yu1ebANwr8_8RC1Uky-zG7LTAhdNYH3hSILGCkVw/exec',
           data: storage_save,
           crossDomain: true,
           success: function (result) {
			var pid = localStore.participant_id; 
			var snoozed = localStore.snoozed; 
			var uniqueKey = localStore.uniqueKey; 
			var pause_time=localStore.pause_time;
			var notifs = localStore.notifs; 
			var surveyStart = localStore.surveyStart;
			var surveyEnd = localStore.surveyEnd;
			var server = localStore.server; 
			var surveyCount = localStore.surveyCount;
			var ParGen_MF = localStore.ParGen_MF;
	        localStore.clear();
	        localStore.participant_id = pid;
	        localStore.snoozed = snoozed;
			localStore.uniqueKey = uniqueKey;
			localStore.pause_time = pause_time;
			localStore.notifs = notifs;
			localStore.surveyStart = surveyStart; 
			localStore.surveyEnd = surveyEnd; 
			localStore.server = server; 
			localStore.surveyCount = surveyCount;
			localStore.ParGen_MF = ParGen_MF;
           	$("#question").html("<h3>Your responses have been recorded. Thank you for completing this survey. <br/><br/> Please make sure notifications for the app are turned on. <br /><br/> Please close the app completely to ensure you will receive your next notifications (Swipe the app up). <br /><br />You can now close the app. </h3>");
           },
           complete: function(data){
           	console.log("completed");
           	},
           	error: function (request, textStatus, errorThrown) {
           		if (textStatus === "timeout"){
					$("#question").html("<h3>It looks like the server is currently overloaded. Please try resending your data later. Click on the button below, and we'll remind you in 30 minutes to try sending your data again. If problems persist, please contact the researchers.</h3><br><button>Set Data Sending Reminder</button>");
					$("#question button").click(function () {app.dataSendingNotif();localStore.snoozed=2;console.log("localStore.snoozed is " + localStore.snoozed);});
				}
				else {
					var response = JSON.stringify(request);
					console.log("request is " + response);
					$("#question").html("<h3>Please try resending data. If problems persist, please contact the researchers.</h3><br><button>Resend data</button>");
					$("#question button").click(function () {app.saveDataLastPage();});
				}
			}
     	});
	}
	if (localStore.server == 4){
	    $.ajax({
           type: 'post',
           url: 'https://script.google.com/macros/s/AKfycby1TM5fXJZPujK5aKYnq8Sr2OMQugCqH4pxAXOupswsukWGviAowmVDNdZ0e7huJBcn/exec',
           data: storage_save,
           crossDomain: true,
           success: function (result) {
			var pid = localStore.participant_id; 
			var snoozed = localStore.snoozed; 
			var uniqueKey = localStore.uniqueKey; 
			var pause_time=localStore.pause_time;
			var notifs = localStore.notifs; 
			var surveyStart = localStore.surveyStart;
			var surveyEnd = localStore.surveyEnd;
			var server = localStore.server; 
			var surveyCount = localStore.surveyCount;
			var ParGen_MF = localStore.ParGen_MF;
	        localStore.clear();
	        localStore.participant_id = pid;
	        localStore.snoozed = snoozed;
			localStore.uniqueKey = uniqueKey;
			localStore.pause_time = pause_time;
			localStore.notifs = notifs;
			localStore.surveyStart = surveyStart; 
			localStore.surveyEnd = surveyEnd; 
			localStore.server = server; 
			localStore.surveyCount = surveyCount;
			localStore.ParGen_MF = ParGen_MF;
           	$("#question").html("<h3>Your responses have been recorded. Thank you for completing this survey. <br/><br/> Please make sure notifications for the app are turned on. <br /><br/> Please close the app completely to ensure you will receive your next notifications (Swipe the app up). <br /><br />You can now close the app. </h3>");
           },
           complete: function(data){
           	console.log("completed");
           	},
           	error: function (request, textStatus, errorThrown) {
           		if (textStatus === "timeout"){
					$("#question").html("<h3>It looks like the server is currently overloaded. Please try resending your data later. Click on the button below, and we'll remind you in 30 minutes to try sending your data again. If problems persist, please contact the researchers.</h3><br><button>Set Data Sending Reminder</button>");
					$("#question button").click(function () {app.dataSendingNotif();localStore.snoozed=2;console.log("localStore.snoozed is " + localStore.snoozed);});
				}
				else {
					var response = JSON.stringify(request);
					console.log("request is " + response);
					$("#question").html("<h3>Please try resending data. If problems persist, please contact the researchers.</h3><br><button>Resend data</button>");
					$("#question button").click(function () {app.saveDataLastPage();});
				}
			}
     	});
	}
},

saveDataLastPage:function() {
//	server 1 - https://script.google.com/macros/s/AKfycbzZMUoc-kZXKCqki6yPaG5cKmc4Bwbl6bka3Rdci97YFc7FXP7SMxAJEzlX8jPzH6Vk/exec
//	server 2 - https://script.google.com/macros/s/AKfycbxMl2sax2uLj9dk_1aHLcRUseAmi5kRoD3CghrNjbTBFDP5asQCqqt3ff-QeRqv21eYaQ/exec
// 	server 3 - https://script.google.com/macros/s/AKfycbyX2Jx6vNg6W-cv2L6XjSuL95PaH0yu1ebANwr8_8RC1Uky-zG7LTAhdNYH3hSILGCkVw/exec
//	server 4 - https://script.google.com/macros/s/AKfycby1TM5fXJZPujK5aKYnq8Sr2OMQugCqH4pxAXOupswsukWGviAowmVDNdZ0e7huJBcn/exec

	var storage = JSON.stringify(localStore);
	var storage_save=JSON.parse(storage);

	/* write data to firebase */
	db.collection("experiencesampling1_responses").add(storage_save);

	/* write data to google sheets */
	if (localStore.server == 1){
	    $.ajax({
           	type: 'post',
           	url: 'https://script.google.com/macros/s/AKfycbzZMUoc-kZXKCqki6yPaG5cKmc4Bwbl6bka3Rdci97YFc7FXP7SMxAJEzlX8jPzH6Vk/exec',
           	data: storage_save,
           	crossDomain: true,
           	success: function (result) {
	         	var pid = localStore.participant_id; 
				var snoozed = localStore.snoozed; 
				var uniqueKey = localStore.uniqueKey; 
				var pause_time=localStore.pause_time;
				var notifs = localStore.notifs; 
				var surveyStart = localStore.surveyStart;
				var surveyEnd = localStore.surveyEnd; 
				var server = localStore.server; 
				var surveyCount = localStore.surveyCount;
				var ParGen_MF = localStore.ParGen_MF;
	         	localStore.clear();
	         	localStore.participant_id = pid;
	         	localStore.snoozed = snoozed;
				localStore.uniqueKey = uniqueKey;
				localStore.pause_time = pause_time;
				localStore.notifs = notifs;
				localStore.surveyStart = surveyStart; 
				localStore.surveyEnd = surveyEnd; 
				localStore.server = server; 
				localStore.surveyCount = surveyCount;
				localStore.ParGen_MF = ParGen_MF;
           		$("#question").html("<h3>Your responses have been recorded. Thank you for completing this survey. <br/><br/> Please close the app completely to ensure you will receive your next notifications (Swipe the app up).</h3>");
         	},
			complete: function(data){
            	console.log("completed");
         	},
			error: function (request, textStatus, errorThrown) {
				if (textStatus === "timeout"){
					$("#question").html("<h3>It looks like the server is currently overloaded. Please try resending your data later. Click on the button below, and we'll remind you in 30 minutes to try sending your data again. If problems persist, please contact the researchers.</h3><br><button>Set Data Sending Reminder</button>");
					$("#question button").click(function () {app.dataSendingNotif();localStore.snoozed=2;console.log("localStore.snoozed is " + localStore.snoozed);});

				}
				else {
					var response = JSON.stringify(request);
					console.log("request is " + response);
					$("#question").html("<h3>Please try resending data. If problems persist, please contact the researchers.</h3><br><button>Resend data</button>");
					$("#question button").click(function () {app.saveDataLastPage();});
				}
			}
        });
	}
	if (localStore.server == 2){
	    $.ajax({
           	type: 'post',
           	url: 'https://script.google.com/macros/s/AKfycbxMl2sax2uLj9dk_1aHLcRUseAmi5kRoD3CghrNjbTBFDP5asQCqqt3ff-QeRqv21eYaQ/exec',
           	data: storage_save,
           	crossDomain: true,
           	success: function (result) {
	         	var pid = localStore.participant_id; 
				var snoozed = localStore.snoozed; 
				var uniqueKey = localStore.uniqueKey; 
				var pause_time=localStore.pause_time;
				var notifs = localStore.notifs; 
				var surveyStart = localStore.surveyStart;
				var surveyEnd = localStore.surveyEnd; 
				var server = localStore.server; 
				var surveyCount = localStore.surveyCount;
				var ParGen_MF = localStore.ParGen_MF;
	         	localStore.clear();
	         	localStore.participant_id = pid;
	         	localStore.snoozed = snoozed;
				localStore.uniqueKey = uniqueKey;
				localStore.pause_time = pause_time;
				localStore.notifs = notifs;
				localStore.surveyStart = surveyStart; 
				localStore.surveyEnd = surveyEnd; 
				localStore.server = server; 
				localStore.surveyCount = surveyCount;
				localStore.ParGen_MF = ParGen_MF;
           		$("#question").html("<h3>Your responses have been recorded. Thank you for completing this survey. <br/><br/> Please close the app completely to ensure you will receive your next notifications (Swipe the app up).</h3>");
         	},
			complete: function(data){
            	console.log("completed");
         	},
			error: function (request, textStatus, errorThrown) {
				if (textStatus === "timeout"){
					$("#question").html("<h3>It looks like the server is currently overloaded. Please try resending your data later. Click on the button below, and we'll remind you in 30 minutes to try sending your data again. If problems persist, please contact the researchers.</h3><br><button>Set Data Sending Reminder</button>");
					$("#question button").click(function () {app.dataSendingNotif();localStore.snoozed=2;console.log("localStore.snoozed is " + localStore.snoozed);});

				}
				else {
					var response = JSON.stringify(request);
					console.log("request is " + response);
					$("#question").html("<h3>Please try resending data. If problems persist, please contact the researchers.</h3><br><button>Resend data</button>");
					$("#question button").click(function () {app.saveDataLastPage();});
				}
			}
        });
	}
	if (localStore.server == 3){
	    $.ajax({
           	type: 'post',
           	url: 'https://script.google.com/macros/s/AKfycbyX2Jx6vNg6W-cv2L6XjSuL95PaH0yu1ebANwr8_8RC1Uky-zG7LTAhdNYH3hSILGCkVw/exec',
           	data: storage_save,
           	crossDomain: true,
           	success: function (result) {
	         	var pid = localStore.participant_id; 
				var snoozed = localStore.snoozed; 
				var uniqueKey = localStore.uniqueKey; 
				var pause_time=localStore.pause_time;
				var notifs = localStore.notifs; 
				var surveyStart = localStore.surveyStart;
				var surveyEnd = localStore.surveyEnd; 
				var server = localStore.server; 
				var surveyCount = localStore.surveyCount;
				var ParGen_MF = localStore.ParGen_MF;
	         	localStore.clear();
	         	localStore.participant_id = pid;
	         	localStore.snoozed = snoozed;
				localStore.uniqueKey = uniqueKey;
				localStore.pause_time = pause_time;
				localStore.notifs = notifs;
				localStore.surveyStart = surveyStart; 
				localStore.surveyEnd = surveyEnd; 
				localStore.server = server; 
				localStore.surveyCount = surveyCount;
				localStore.ParGen_MF = ParGen_MF;
           		$("#question").html("<h3>Your responses have been recorded. Thank you for completing this survey. <br/><br/> Please close the app completely to ensure you will receive your next notifications (Swipe the app up).</h3>");
         	},
			complete: function(data){
            	console.log("completed");
         	},
			error: function (request, textStatus, errorThrown) {
				if (textStatus === "timeout"){
					$("#question").html("<h3>It looks like the server is currently overloaded. Please try resending your data later. Click on the button below, and we'll remind you in 30 minutes to try sending your data again. If problems persist, please contact the researchers.</h3><br><button>Set Data Sending Reminder</button>");
					$("#question button").click(function () {app.dataSendingNotif();localStore.snoozed=2;console.log("localStore.snoozed is " + localStore.snoozed);});

				}
				else {
					var response = JSON.stringify(request);
					console.log("request is " + response);
					$("#question").html("<h3>Please try resending data. If problems persist, please contact the researchers.</h3><br><button>Resend data</button>");
					$("#question button").click(function () {app.saveDataLastPage();});
				}
			}
        });
	}
	if (localStore.server == 4){
	    $.ajax({
           	type: 'post',
           	url: 'https://script.google.com/macros/s/AKfycby1TM5fXJZPujK5aKYnq8Sr2OMQugCqH4pxAXOupswsukWGviAowmVDNdZ0e7huJBcn/exec',
           	data: storage_save,
           	crossDomain: true,
           	success: function (result) {
	         	var pid = localStore.participant_id; 
				var snoozed = localStore.snoozed; 
				var uniqueKey = localStore.uniqueKey; 
				var pause_time=localStore.pause_time;
				var notifs = localStore.notifs; 
				var surveyStart = localStore.surveyStart;
				var surveyEnd = localStore.surveyEnd; 
				var server = localStore.server; 
				var surveyCount = localStore.surveyCount;
				var ParGen_MF = localStore.ParGen_MF;
	         	localStore.clear();
	         	localStore.participant_id = pid;
	         	localStore.snoozed = snoozed;
				localStore.uniqueKey = uniqueKey;
				localStore.pause_time = pause_time;
				localStore.notifs = notifs;
				localStore.surveyStart = surveyStart; 
				localStore.surveyEnd = surveyEnd; 
				localStore.server = server; 
				localStore.surveyCount = surveyCount;
				localStore.ParGen_MF = ParGen_MF;
           		$("#question").html("<h3>Your responses have been recorded. Thank you for completing this survey. <br/><br/> Please close the app completely to ensure you will receive your next notifications (Swipe the app up).</h3>");
         	},
			complete: function(data){
            	console.log("completed");
         	},
			error: function (request, textStatus, errorThrown) {
				if (textStatus === "timeout"){
					$("#question").html("<h3>It looks like the server is currently overloaded. Please try resending your data later. Click on the button below, and we'll remind you in 30 minutes to try sending your data again. If problems persist, please contact the researchers.</h3><br><button>Set Data Sending Reminder</button>");
					$("#question button").click(function () {app.dataSendingNotif();localStore.snoozed=2;console.log("localStore.snoozed is " + localStore.snoozed);});

				}
				else {
					var response = JSON.stringify(request);
					console.log("request is " + response);
					$("#question").html("<h3>Please try resending data. If problems persist, please contact the researchers.</h3><br><button>Resend data</button>");
					$("#question button").click(function () {app.saveDataLastPage();});
				}
			}
        });
	}
},

saveDataAndClear:function() {
//	server 1 - https://script.google.com/macros/s/AKfycbzZMUoc-kZXKCqki6yPaG5cKmc4Bwbl6bka3Rdci97YFc7FXP7SMxAJEzlX8jPzH6Vk/exec
//	server 2 - https://script.google.com/macros/s/AKfycbxMl2sax2uLj9dk_1aHLcRUseAmi5kRoD3CghrNjbTBFDP5asQCqqt3ff-QeRqv21eYaQ/exec
// 	server 3 - https://script.google.com/macros/s/AKfycbyX2Jx6vNg6W-cv2L6XjSuL95PaH0yu1ebANwr8_8RC1Uky-zG7LTAhdNYH3hSILGCkVw/exec
//	server 4 - https://script.google.com/macros/s/AKfycby1TM5fXJZPujK5aKYnq8Sr2OMQugCqH4pxAXOupswsukWGviAowmVDNdZ0e7huJBcn/exec

	var storage = JSON.stringify(localStore);
	var storage_save=JSON.parse(storage);

	/* write data to firebase */
	db.collection("experiencesampling1_alldata").add(storage_save);

	/* write data to google sheets */

	if (localStore.server == 1){
		$.ajax({
				 type: 'post',
				 url: 'https://script.google.com/macros/s/AKfycbzZMUoc-kZXKCqki6yPaG5cKmc4Bwbl6bka3Rdci97YFc7FXP7SMxAJEzlX8jPzH6Vk/exec',
				 data: storage_save,
				 crossDomain: true,
				 success: function (result) {
				 var pid = localStore.participant_id; 
				 var snoozed = localStore.snoozed; 
				 var uniqueKey = localStore.uniqueKey; 
				 var pause_time=localStore.pause_time;
				 var notifs = localStore.notifs; 
				 var surveyStart = localStore.surveyStart;
				 var surveyEnd = localStore.surveyEnd; 
				 var server = localStore.server; 
				 var surveyCount = localStore.surveyCount;
				 var ParGen_MF = localStore.ParGen_MF;
				 localStore.clear();
				 localStore.participant_id = pid;
				 localStore.snoozed = snoozed;
				 localStore.uniqueKey = uniqueKey;
				 localStore.pause_time = pause_time;
				 localStore.notifs = notifs;
				 localStore.surveyStart = surveyStart; 
				 localStore.surveyEnd = surveyEnd; 
				 localStore.server = server; 
				 localStore.surveyCount = surveyCount;
				 localStore.ParGen_MF = ParGen_MF;
			 },
			 complete: function(data){
				console.log("completed");
			 },
			 error: function (request, error) {
				console.log(error);
				var response = JSON.stringify(request);
				console.log("request is " + response);
				}
			});	
		}
	if (localStore.server == 2){
		$.ajax({
				 type: 'post',
				 url: 'https://script.google.com/macros/s/AKfycbxMl2sax2uLj9dk_1aHLcRUseAmi5kRoD3CghrNjbTBFDP5asQCqqt3ff-QeRqv21eYaQ/exec',
				 data: storage_save,
				 crossDomain: true,
				 success: function (result) {
				 var pid = localStore.participant_id; 
				 var snoozed = localStore.snoozed; 
				 var uniqueKey = localStore.uniqueKey; 
				 var pause_time=localStore.pause_time;
				 var notifs = localStore.notifs; 
				 var surveyStart = localStore.surveyStart;
				 var surveyEnd = localStore.surveyEnd; 
				 var server = localStore.server; 
				 var surveyCount = localStore.surveyCount;
				 var ParGen_MF = localStore.ParGen_MF;
				 localStore.clear();
				 localStore.participant_id = pid;
				 localStore.snoozed = snoozed;
				 localStore.uniqueKey = uniqueKey;
				 localStore.pause_time = pause_time;
				 localStore.notifs = notifs;
				 localStore.surveyStart = surveyStart; 
				 localStore.surveyEnd = surveyEnd; 
				 localStore.server = server; 
				 localStore.surveyCount = surveyCount;
				 localStore.ParGen_MF = ParGen_MF;
			 },
			 complete: function(data){
				console.log("completed");
			 },
			 error: function (request, error) {
				console.log(error);
				var response = JSON.stringify(request);
				console.log("request is " + response);
			}
		});	
	}
	if (localStore.server == 3){
		$.ajax({
				 type: 'post',
				 url: 'https://script.google.com/macros/s/AKfycbyX2Jx6vNg6W-cv2L6XjSuL95PaH0yu1ebANwr8_8RC1Uky-zG7LTAhdNYH3hSILGCkVw/exec',
				 data: storage_save,
				 crossDomain: true,
				 success: function (result) {
				 var pid = localStore.participant_id; 
				 var snoozed = localStore.snoozed; 
				 var uniqueKey = localStore.uniqueKey; 
				 var pause_time=localStore.pause_time;
				 var notifs = localStore.notifs; 
				 var surveyStart = localStore.surveyStart;
				 var surveyEnd = localStore.surveyEnd; 
				 var server = localStore.server; 
				 var surveyCount = localStore.surveyCount;
				 var ParGen_MF = localStore.ParGen_MF;
				 localStore.clear();
				 localStore.participant_id = pid;
				 localStore.snoozed = snoozed;
				 localStore.uniqueKey = uniqueKey;
				 localStore.pause_time = pause_time;
				 localStore.notifs = notifs;
				 localStore.surveyStart = surveyStart; 
				 localStore.surveyEnd = surveyEnd; 
				 localStore.server = server; 
				 localStore.surveyCount = surveyCount;
				 localStore.ParGen_MF = ParGen_MF;
			 },
			 complete: function(data){
				console.log("completed");
			 },
			 error: function (request, error) {
				console.log(error);
				var response = JSON.stringify(request);
				console.log("request is " + response);
			}
		});	
	}
	if (localStore.server == 4){
		$.ajax({
				 type: 'post',
				 url: 'https://script.google.com/macros/s/AKfycby1TM5fXJZPujK5aKYnq8Sr2OMQugCqH4pxAXOupswsukWGviAowmVDNdZ0e7huJBcn/exec',
				 data: storage_save,
				 crossDomain: true,
				 success: function (result) {
				 var pid = localStore.participant_id; 
				 var snoozed = localStore.snoozed; 
				 var uniqueKey = localStore.uniqueKey; 
				 var pause_time=localStore.pause_time;
				 var notifs = localStore.notifs; 
				 var surveyStart = localStore.surveyStart;
				 var surveyEnd = localStore.surveyEnd; 
				 var server = localStore.server; 
				 var surveyCount = localStore.surveyCount;
				 var ParGen_MF = localStore.ParGen_MF;
				 localStore.clear();
				 localStore.participant_id = pid;
				 localStore.snoozed = snoozed;
				 localStore.uniqueKey = uniqueKey;
				 localStore.pause_time = pause_time;
				 localStore.notifs = notifs;
				 localStore.surveyStart = surveyStart; 
				 localStore.surveyEnd = surveyEnd; 
				 localStore.server = server; 
				 localStore.surveyCount = surveyCount;
				 localStore.ParGen_MF = ParGen_MF;
			 },
			 complete: function(data){
				console.log("completed");
			 },
			 error: function (request, error) {
				console.log(error);
				var response = JSON.stringify(request);
				console.log("request is " + response);
			}
		});	
	}
},

//uncomment this function to test data saving function (Stage 2 of Customization)
saveData:function() {
//	server 1 - https://script.google.com/macros/s/AKfycbzZMUoc-kZXKCqki6yPaG5cKmc4Bwbl6bka3Rdci97YFc7FXP7SMxAJEzlX8jPzH6Vk/exec
//	server 2 - https://script.google.com/macros/s/AKfycbxMl2sax2uLj9dk_1aHLcRUseAmi5kRoD3CghrNjbTBFDP5asQCqqt3ff-QeRqv21eYaQ/exec
// 	server 3 - https://script.google.com/macros/s/AKfycbyX2Jx6vNg6W-cv2L6XjSuL95PaH0yu1ebANwr8_8RC1Uky-zG7LTAhdNYH3hSILGCkVw/exec
//	server 4 - https://script.google.com/macros/s/AKfycby1TM5fXJZPujK5aKYnq8Sr2OMQugCqH4pxAXOupswsukWGviAowmVDNdZ0e7huJBcn/exec

	var storage = JSON.stringify(localStore);
	var storage_save=JSON.parse(storage);
	
	/* write data to firebase */
	db.collection("experiencesampling1_alldata").add(storage_save);

	/* write data to google sheets */
	if (localStore.server == 1){
		$.ajax({
			type: 'post',
			url: 'https://script.google.com/macros/s/AKfycbzZMUoc-kZXKCqki6yPaG5cKmc4Bwbl6bka3Rdci97YFc7FXP7SMxAJEzlX8jPzH6Vk/exec',
		   	data: storage_save,
		   	crossDomain: true,
		   	success: function (result) {
		   		var pid = localStore.participant_id; 
		   		var snoozed = localStore.snoozed; 
				var uniqueKey = localStore.uniqueKey; 
				var pause_time=localStore.pause_time;
				var notifs = localStore.notifs; 
				var surveyStart = localStore.surveyStart;
				var surveyEnd = localStore.surveyEnd; 
				var server = localStore.server
				var surveyCount = localStore.surveyCount;
				var ParGen_MF = localStore.ParGen_MF;
			 	localStore.participant_id = pid;
			 	localStore.snoozed = snoozed;
				localStore.uniqueKey = uniqueKey;
				localStore.pause_time = pause_time;
				localStore.notifs = notifs;
				localStore.surveyStart = surveyStart; 
				localStore.surveyEnd = surveyEnd;
				localStore.server = server; 
				localStore.surveyCount = surveyCount;
				localStore.ParGen_MF = ParGen_MF;
		   	},
		   	complete: function(data){
				console.log("completed");
			},
			error: function (request, error) {
				console.log(error);
				var response = JSON.stringify(request);
				console.log("request is " + response);
			}
		});
	}
	if (localStore.server == 2){
		$.ajax({
			type: 'post',
			url: 'https://script.google.com/macros/s/AKfycbxMl2sax2uLj9dk_1aHLcRUseAmi5kRoD3CghrNjbTBFDP5asQCqqt3ff-QeRqv21eYaQ/exec',
		   	data: storage_save,
		   	crossDomain: true,
		   	success: function (result) {
		   		var pid = localStore.participant_id; 
		   		var snoozed = localStore.snoozed; 
				var uniqueKey = localStore.uniqueKey; 
				var pause_time=localStore.pause_time;
				var notifs = localStore.notifs; 
				var surveyStart = localStore.surveyStart;
				var surveyEnd = localStore.surveyEnd; 
				var server = localStore.server
				var surveyCount = localStore.surveyCount;
				var ParGen_MF = localStore.ParGen_MF;
			 	localStore.participant_id = pid;
			 	localStore.snoozed = snoozed;
				localStore.uniqueKey = uniqueKey;
				localStore.pause_time = pause_time;
				localStore.notifs = notifs;
				localStore.surveyStart = surveyStart; 
				localStore.surveyEnd = surveyEnd;
				localStore.server = server; 
				localStore.surveyCount = surveyCount;
				localStore.ParGen_MF = ParGen_MF;
		   	},
		   	complete: function(data){
				console.log("completed");
			},
			error: function (request, error) {
				console.log(error);
				var response = JSON.stringify(request);
				console.log("request is " + response);
			}
		});
	}
	if (localStore.server == 3){
		$.ajax({
			type: 'post',
			url: 'https://script.google.com/macros/s/AKfycbyX2Jx6vNg6W-cv2L6XjSuL95PaH0yu1ebANwr8_8RC1Uky-zG7LTAhdNYH3hSILGCkVw/exec',
		   	data: storage_save,
		   	crossDomain: true,
		   	success: function (result) {
		   		var pid = localStore.participant_id; 
		   		var snoozed = localStore.snoozed; 
				var uniqueKey = localStore.uniqueKey; 
				var pause_time=localStore.pause_time;
				var notifs = localStore.notifs; 
				var surveyStart = localStore.surveyStart;
				var surveyEnd = localStore.surveyEnd; 
				var server = localStore.server
				var surveyCount = localStore.surveyCount;
				var ParGen_MF = localStore.ParGen_MF;
			 	localStore.participant_id = pid;
			 	localStore.snoozed = snoozed;
				localStore.uniqueKey = uniqueKey;
				localStore.pause_time = pause_time;
				localStore.notifs = notifs;
				localStore.surveyStart = surveyStart; 
				localStore.surveyEnd = surveyEnd;
				localStore.server = server; 
				localStore.surveyCount = surveyCount;
				localStore.ParGen_MF = ParGen_MF;
		   	},
		   	complete: function(data){
				console.log("completed");
			},
			error: function (request, error) {
				console.log(error);
				var response = JSON.stringify(request);
				console.log("request is " + response);
			}
		});
	}
	if (localStore.server == 4){
		$.ajax({
			type: 'post',
			url: 'https://script.google.com/macros/s/AKfycby1TM5fXJZPujK5aKYnq8Sr2OMQugCqH4pxAXOupswsukWGviAowmVDNdZ0e7huJBcn/exec',
		   	data: storage_save,
		   	crossDomain: true,
		   	success: function (result) {
		   		var pid = localStore.participant_id; 
		   		var snoozed = localStore.snoozed; 
				var uniqueKey = localStore.uniqueKey; 
				var pause_time=localStore.pause_time;
				var notifs = localStore.notifs; 
				var surveyStart = localStore.surveyStart;
				var surveyEnd = localStore.surveyEnd; 
				var server = localStore.server;
				var surveyCount = localStore.surveyCount;
				var ParGen_MF = localStore.ParGen_MF;
			 	localStore.participant_id = pid;
			 	localStore.snoozed = snoozed;
				localStore.uniqueKey = uniqueKey;
				localStore.pause_time = pause_time;
				localStore.notifs = notifs;
				localStore.surveyStart = surveyStart; 
				localStore.surveyEnd = surveyEnd;
				localStore.server = server; 
				localStore.surveyCount = surveyCount;
				localStore.ParGen_MF = ParGen_MF;
		   	},
		   	complete: function(data){
				console.log("completed");
			},
			error: function (request, error) {
				console.log(error);
				var response = JSON.stringify(request);
				console.log("request is " + response);
			}
		});
	}
},
    
// Local Notifications Javascript
// Stage 5 of Customization
// This code is for signal-contingent designs with varying time intervals between notifications
// i.e., customized to each participant's schedule
scheduleNotifs:function() {
	//Section 1 - Declaring necessary variables
		//Declares the number of intervals between the notifications for each day (i.e., if beeping participants 6 times, declare 6 intervals)
    var interval1, interval2;

		//Declares a variable to represent the id of each notification for the day
		//Declare as many letters as you have intervals (i.e., 6 intervals, declare 6 ids)
    var a, b;

		//Declare a variable to represent new date to be calculated for each beep
		//That is, if there are 6 intervals, declare 6 new dates
    var date1, date2;

		//The statement below declares the start and end time of the daily data collection period
		//These variables are not necessary if the start and end time of the daily data collection period do not vary across the experience
		//sampling data collection period
		// declare start and end of each survey block
    var survey1Start, survey1End, survey2Start, survey2End;

		//The next three lines create variables for the present time when the notifications are being scheduled
    var dateObject = new Date();
    var now = dateObject.getTime();
    var dayOfWeek = dateObject.getDay(), currentHour = dateObject.getHours(), currentMinute = dateObject.getMinutes();

		//The next variables represent the amount of time between the end of the data collection to the start of the next one (nightlyLag), 
		//the interval between the scheduling time and the start of the first data collection period (currentLag), the maximum amount of time
		//in the data collection period (maxInterval), and the time between until the end of the next data collection period (in our case 
		//dinner time; dinnerInterval)
    var currentLag, maxInterval, dinnerInterval;

		//These represent the participant's time values 
		survey1Start = localStore.survey1Start.split(":");
		//survey1End = localStore.survey1End.split(":");
		survey2Start = localStore.survey2Start.split(":");
		//survey2End = localStore.survey2End.split(":");
		
// 		alert("survey1Start is " + survey1Start); 
// 		alert("survey1End is " + survey1End); 
// 		alert("survey2Start is " + survey2Start); 
// 		alert("survey2End is " + survey2End); 

	//Then you can declare any values that you might use more than once such as the number of milliseconds in a day
   	var day = 86400000; 

		//This is a loop that repeats this block of codes for the number of days there are in the experience sampling period
		//Replace X with the number of days in the experience sampling period (e.g., collecting data for 7 days, replace X with 7)
		//Note that iOS apps can only have 64 unique notifications, so you should keep that in mind if you are collecting data 
		//for more than longer periods of time
		var time1 = new Date(); 
		var time2 = new Date(); 
		var time3 = new Date();
		var time4 = new Date(); 
		
		// add one day to each of these new date objects so the surveys start tomorrow
		// **CHANGEME** to test, I removed the +1--> to changeback, do 	var day1 = time1.getDate() + 1;
		var day1 = time1.getDate(); 
		var day2 = time2.getDate(); 
		var day3 = time3.getDate(); 
		var day4 = time4.getDate(); 
		
		// now set the survey start and end times 
		var survey1StartTime = time1.setDate(day1); 
		survey1StartTime = time1.setHours(parseInt(survey1Start[0]), parseInt(survey1Start[1]), 0, 0); 
		var survey1EndTime = time2.setDate(day2); 
		survey1EndTime = time2.setHours((parseInt(survey1Start[0])+parseInt(SURVEYBLOCKHOUR)), parseInt(survey1Start[1]), 0, 0);
			// uncomment below to test notifs quickly (3 min window)
			// survey1EndTime = time2.setHours(parseInt(survey1Start[0]), (parseInt(survey1Start[1])+parseInt(SURVEYBLOCKHOUR)), 0, 0);
		// uncomment below if you want participants to set their own end times for each block
		//survey1EndTime = time2.setHours(parseInt(survey1End[0]), parseInt(survey1End[1]), 0, 0); 



		var survey2StartTime = time3.setDate(day3); 
		survey2StartTime = time3.setHours(parseInt(survey2Start[0]), parseInt(survey2Start[1]), 0, 0); 
		var survey2EndTime = time4.setDate(day4); 
		survey2EndTime = time4.setHours((parseInt(survey2Start[0])+parseInt(SURVEYBLOCKHOUR)), parseInt(survey2Start[1]), 0, 0);
			// uncomment below to test notifs quickly (3 min window)
			// survey2EndTime = time4.setHours(parseInt(survey2Start[0]), (parseInt(survey2Start[1])+parseInt(SURVEYBLOCKHOUR)), 0, 0);
		// uncomment below if you want participants to set their own end times for each block
		// survey2EndTime = time4.setHours(parseInt(survey2End[0]), parseInt(survey2End[1]), 0, 0); 


// 		alert("survey1StartTime is " + survey1StartTime); 
// 		alert("survey1EndTime is " + survey1EndTime); 
// 		alert("survey2StartTime is " + survey2StartTime); 
// 		alert("survey2EndTime is " + survey2EndTime); 

    for (i = 0; i < 21; i++) {
    	var survey1Min  = survey1StartTime + day*i; 
    	var survey1Max  = survey1EndTime + day*i; 

    	var survey2Min  = survey2StartTime + day*i; 
    	var survey2Max  = survey2EndTime + day*i; 

		// randomly select survey time
    	interval1 = app.selectSurveyTime(survey1Min, survey1Max); 
    	interval2 = app.selectSurveyTime(survey2Min, survey2Max); 

		// set a unique id number for each notification    	
        a = 101+(parseInt(i)*100);
        b = 102+(parseInt(i)*100);
// 
// 			//This part of the code calculates the time when the notification should be sent by adding the time interval to the current date and time        
        date1 = new Date(interval1); 
        date2 = new Date(interval2);
        
    	epoch1 = date1.getTime();
		epoch2 = date2.getTime();

		cordova.plugins.notification.local.schedule([
			{id: a, trigger: {at: new Date(epoch1)}, text: 'Time for your first survey for the day! You have 2 hours to do it!', title: 'Daily Study about the Self', priority:2, vibrate:true},
			{id: b, trigger: {at: new Date(epoch2)}, text: "Time for your second survey for the day! You have 2 hours to do it!", title: 'Daily Study about the Self', priority:2, vibrate:true},
		]);

		//This part of the code records when the notifications are scheduled for and sends it to the server
		localStore['notification_' + i + '_1'] = localStore.participant_id + "_" + a + "_" + date1;
		localStore['notification_' + i + '_2'] = localStore.participant_id + "_" + b + "_" + date2;
		
		notifs.push(interval1, interval2);
    }
    surveyStart = parseInt(notifs[0]); //**CHANGEME ADDED PARSEINT TO THIS */
    surveyEnd = (parseInt(notifs[41]) + parseInt(surveyWindow)); 
    localStore.surveyStart = surveyStart; 
    localStore.surveyEnd = surveyEnd;
    localStore.notifs = notifs; 
},

//Stage 4 of Customization
//Uncomment lines inside the snoozeNotif function to test the snooze scheduling notification function
//Replace X with the number of seconds you want the app to snooze for (e.g., 10 minutes is 600 seconds)
//You can also customize the Title of the message, the snooze message that appears in the notification
snoozeNotif:function() {
    var now = new Date().getTime(), snoozeDate = new Date(now + 600*1000);
    var id = '99';
    cordova.plugins.notification.local.schedule({
                                         id: id,
                                         title: 'Diary Survey',
                                         text: 'Are you able to take the survey now?',
                                         at: snoozeDate,
                                         });
},
// function to request notification permission
requestNotifPerm:function() {
	permissions.requestPermission(permissions.POST_NOTIFICATIONS, permsuccessCallback, permerrorCallback);
	function permerrorCallback() {
		console.warn('You have not granted this app permission to receive notifications. Please navigate to Settings > App Info and toggle notifications for this app.');
	};
	function permsuccessCallback( status ) {
		if( !status.hasPermission ) permerrorCallback();
	};
},
// function to schedule the test notification
testNotif:function() {
    var id = '9999';
	cordova.plugins.notification.local.setDefaults({
		vibrate: true,
		icon: 'res://img/icon.png',
		smallIcon: 'res://img/icon.png',
	});
//	cordova.plugins.notification.local.requestPermission(function (granted) {
//		showToast(granted ? 'Thank you. This app now has permission to receive notifications.' : 'This app does NOT have permission to receive notifications. Please navigate to Settings > App Info and toggle notifications for this app.');
//	});
    cordova.plugins.notification.local.schedule({
                                         icon: 'ic_launcher',
                                         id: id,
                                         title: 'Daily Surveys',
                                         text: 'Your test notification has fired!',
                                         trigger: {in: 3, unit: 'second'},
                                         });
},

// function to schedule data resent reminder
dataSendingNotif:function() {
    var now = new Date().getTime();
    var id = '98';
    cordova.plugins.notification.local.schedule({
		id: id,
		title: 'Diary Surveys',
		text: 'Please try resending your data now!',
		trigger: {in: 30, unit: 'minute'},
		icon: 'ic_launcher',});
},

//This function forces participants to respond to an open-ended question if they have left it blank
validateResponse: function(data){
        var text = data.val();
//         console.log(text);
        if (text === ""){
        	return false;
        } else { 
        	return true;
        }
    },
validateNumber: function(data){
        var num = data.val();
//         console.log(text);
		if (num === "") {
			return false
		}
        else if (isNaN(num)){
        	return false;
        } 
        else { 
        	return true;
        }
    },  
validateTime: function(data){ //check to see that participants entered a time
	var time = data.val();
	if (time=== ""){
		return false	
	} else if (time.split(":")[0] >= (parseInt(24)-parseInt(SURVEYBLOCKHOUR))){ // don't allow participants to pick a time X hours before midnight
		return false
	}
	else {
		var survey1timevalidate = time.split(":");
		localStore.survey1timevalidate = survey1timevalidate; 
		return true
	}
},
//add validatetime2 here
validateTime2: function(data){ //check if the second time block is at least X hours after the first; set this with SURVEYBLOCKHOUR var
	//**CHANGEME**//
	var time = data.val();
	var hour = time.split(":")[0]; 
	var minute = time.split(":")[1]; 
	var survey1timevalidate = localStore.survey1timevalidate;
	var survey1timevalidate = survey1timevalidate.split(",");
	if(time=== ""){
		return false
	} else if (parseInt(hour) < (parseInt(survey1timevalidate[0])+parseInt(SURVEYBLOCKHOUR))){ // if time2 is less than X hours after time1, throw error
		return false
	} else if (parseInt(hour) === ((parseInt(survey1timevalidate[0])+parseInt(SURVEYBLOCKHOUR)) && parseInt(minute) < parseInt(survey1timevalidate[1]))){ //if time2 is less than X hours after time1, throw error
		return false
	} else {
		return true
	}
},
validateId: function(data){
	var id = data.val();
	var length = id.length;
	if (id === ""){
		return false	
	}
	else if (id.length != 3){
		return false
	}
	else {
		return true
	}
}, 

// function to randomly pick one question from the array
randomSelectQs: function(array){
	// this function will randomly select one of the questions in the array of questions that need to be randomized
	var randomIndex = Math.floor(Math.random()*array.length);
	// it will then return the item it has selected and remove it from the array so no question is shown twice
	return array.splice(randomIndex, 1)[0]; 
}, 

selectSurveyTime: function(min, max){
	// this function will randomly select a time between the start and end time of the survey block set by participants. 
	return Math.floor(Math.random()*(max-min + 1) + min)
},

validateId2: function(data){
	var id = data.val();
	var length = id.length;
	if (id === ""){
		return false	
	}
	else if (id.length != 2){
		return false
	}
	else {
		return true
	}
},
 	
};

/* request notification permission */
showToast = function (text) {
    var isMac = navigator.userAgent.toLowerCase().includes('macintosh');

    setTimeout(function () {
        if (window.Windows !== undefined) {
            showWinDialog(text);
        } else
        if (!isMac && window.plugins && window.plugins.toast) {
            window.plugins.toast.showShortBottom(String(text));
        }
        else {
            alert(text);
        }
    }, 500);
};

showWinDialog = function (text) {
    if (dialog) {
        dialog.content = text;
        return;
    }

    dialog = new Windows.UI.Popups.MessageDialog(text);

    dialog.showAsync().done(function () {
        dialog = null;
    });
};

if (window.hasOwnProperty('Windows')) {
    alert = showWinDialog;
}
