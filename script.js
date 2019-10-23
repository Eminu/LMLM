var quizzQuestion;
var NextImg;		//utilisée pour le time de l'index (changement d'images)
var NumDiapo;		//variable permettant de faire varier les images dans la page d'accueil
var Gomme;			//utilisée pour le timer de la page quizz
var RotationCartes;	//uilisée pour le timer lancé au chargement de la page jeu-de-carte
var ErreurCartes;	//utilisée pour le timer lancé pendant le jeu-de-carte
var Click2;			//mémorisation du nom d'une carte retournée et en attente de sa soeur dans le jeu de carte
var LastCard;		//mémorisation de la position de la carte maintenu retournée dans le jeu de cartes
var paire;			//nombre d'image sélectionné à l'instant T
var Pioche=["train_1","train_2","tram_1","herisson","tram_2","train_1","train_2","tram_1","tram_2"];
var CarteRetournee=[];			//tableau contenant le nom des paires déjà choisies par le joueur dans le jeu de carte

// ----------------------- INDEX --------------------------

function IntroDiapo() {
	var album=["voiture.jpg", "ocean-tram.jpg", "viaduc-train.jpg", "rails.jpg", "chita.jpg"]
	if (NumDiapo==album.length) {
		NumDiapo=0;
		$('#slide').css('background', 'url(images/velo.jpg)');
	}
	else {
		document.getElementById('slide').style.background= "url(images/"+album[NumDiapo]+")";
		NumDiapo=NumDiapo+1;
	}
	//background-image: url(images/velo.jpg);
}

function IntroModif() {
	//fonction qui va prendre le texte écrit dans le formulaire et l'inscrire dans le paragraphe "HelloWorld" 
	//S'active à chaque inscription de caractère dans la zone de texte
	document.getElementById("HelloWorld").innerHTML = document.formu.message.value;
}

// ----------------------- QUIZZ --------------------------

function quizzChoix(Rep) { 
	//Fonction qui permet faire défiler les questions, leurs images et prend également en charge l'affichage des corrections 
	//pendant comme à la fin du jeu.
	var image1= ["usa", "pantographe","bratsk","voiture"];	//Noms des images de gauche
	var image2=["france", "ballast", "chita", "velo"];		//Noms des images de droite
	var juste=["A", "B", "B", "A"];							//Tableau répertoriant l'image juste pour chaque question
	var reponses=[											//tableau avec les corrections
		"La première ligne de tramway reliait New York à Harlem dès 1832.",
		"Le ballast est un lit de pierre et de gravier servant de vase à la voie ferrée.",
		"Bratsk se trouve sur la Baikal-Amur Railway alors que Chita est un point de liaison entre le Transsibérien et le Transmanchurian.",
		"Avec la démocratisation des autobus et des véhicules personnels, le tramway disparait quasi complétement en Amérique du Nord et en Europe de l'ouest."
		];
	if(quizzQuestion<3){								//on limite l'action de la boucle au nombre de questions enregistrées
		clearTimeout(Gomme);							//Annule le compte à rebour au cas où une correction soit encore affichée au moment du click
		if(Rep==juste[quizzQuestion]){					//uniquement quand la lettre reçue correspond à celle de la bonne réponse (dans le tableau)
			alert("Bravo!");
		}
		else {											//Quand la réponse donnée est fausse...
			document.getElementById("Corr").innerHTML= reponses[quizzQuestion];
			$('#Corr').show();
			Gomme= setTimeout(TimerQuizz, 8000);		//Appelle une fonction qui réalise une action au bout de 8 secondes
		}
		document.img1.src='../images/'+image1[quizzQuestion+1]+'.jpg';		//on change l'image de gauche pour la question suivante
		document.img2.src='../images/'+image2[quizzQuestion+1]+'.jpg';		//idem avec l'image de droite
		$('#Q'+quizzQuestion).hide();										//on cache la question qui vient d'être posée..
		$('#Q'+(quizzQuestion+1)).show();									//..et on affiche la suivante
		quizzQuestion=quizzQuestion+1; 										//prise en compte du passage à la question suivante
	}
	else {
		if (quizzQuestion>3) return;						//Dans le cas où le joueur clic de trop sur les images									//..et on affiche la suivante
		quizzQuestion=quizzQuestion+1; 
		document.getElementById("Q3").innerHTML= "Vous avez atteint la fin du quizz. Pour rappel, les éléments de réponse étaient:";
		for(i=0; i<4; i++) {							//affichage de toutes les corrections dans un nouveau p
			var parag = document.createElement("p");	//Stockage du type d'élément que l'on compte ajouter par la suite
			var t = document.createTextNode("Correction "+(i+1)+": "+reponses[i]);	//contenu de l'élément créé
			parag.appendChild(t);
			document.body.appendChild(parag);			//affichage dans la page	
		}
	}
	// console.log(quizzQuestion);
	// console.log(Rep);
}

function TimerQuizz() {				//fonction qui est activée au bout de 10 secondes pour effacer la correction.
	$('#Corr').hide();		
}

function quizzColor(lettre) {		//fonction qui encadre l'image survolée par la souris en jaune
	switch(lettre) {
		case 'A' : $('#A').css('border', 'solid yellow'); break; 	//Dans le cas où c'est l'image de gauche qui est survolée, on va modifier le CSS pour l'élément #A
		case 'B' : $('#B').css('border', 'solid yellow'); break;	//Dans le cas où c'est l'image de droite qui est survolée, on va modifier le CSS pour l'élément #B
		default : alert("quizzColor: Elément introuvable");
	}
}

function quizzOut(OutLet) {			//fonction qui annule le cadre jaune après que la souris ait quitté l'image
	switch(OutLet) {
		case 'A' : $('#A').css('border', 'none'); break;
		case 'B' : $('#B').css('border', 'none'); break;
		default : alert("quizzOut: Elément introuvable");
	}
}

// ----------------------- JEU DE CARTES --------------------------

function CarteHide() {
	//fonction qui attribut aléatoirement les images aux emplacements html
	//et les affiche pendant un temps avant de les faire disparaitre
	for(i=0; i<Pioche.length; i++) {			//Boucle qui à chaque balise image du HTML associe une carte dans le tableau ci-dessus
		document.getElementById("I"+(i+1)).src= "../images/"+Pioche[i]+".jpg";

	}
	RotationCartes= setTimeout(TimerCarte, 5000);	//Appel d'une fonction s'exécutant après un délai de 5s
}

function TimerCarte() {				//fonction qui est activée au bout de 5 secondes pour cacher les cartes.
	for(i=1; i<10; i++){			//boucle permettant de cacher toutes les cartes à apparier et de les remplacer par leur dos
		$('#I'+i).hide();
		$('#Dos'+i).show();
	}		
}

function CarteSelect(SelCarte) {	//fonction qui réduit l'opacité de l'image sélectionnée
	switch(SelCarte) {
		case 'a' : $('#Dos1').css('opacity', '0.5'); break;
		case 'b' : $('#Dos2').css('opacity', '0.5'); break;
		case 'c' : $('#Dos3').css('opacity', '0.5'); break;
		case 'd' : $('#Dos4').css('opacity', '0.5'); break;
		case 'e' : $('#Dos5').css('opacity', '0.5'); break;
		case 'f' : $('#Dos6').css('opacity', '0.5'); break;
		case 'g' : $('#Dos7').css('opacity', '0.5'); break;
		case 'h' : $('#Dos8').css('opacity', '0.5'); break;
		case 'i' : $('#Dos9').css('opacity', '0.5'); break;
		default : alert("SelCarte: Elément introuvable");
	}
}

function CarteOut(OutCarte){		//fonction qui réduit l'opacité de l'image sélectionnée
	switch(OutCarte) {
		case 'a' : $('#Dos1').css('opacity', '1'); break;
		case 'b' : $('#Dos2').css('opacity', '1'); break;
		case 'c' : $('#Dos3').css('opacity', '1'); break;
		case 'd' : $('#Dos4').css('opacity', '1'); break;
		case 'e' : $('#Dos5').css('opacity', '1'); break;
		case 'f' : $('#Dos6').css('opacity', '1'); break;
		case 'g' : $('#Dos7').css('opacity', '1'); break;
		case 'h' : $('#Dos8').css('opacity', '1'); break;
		case 'i' : $('#Dos9').css('opacity', '1'); break;
		default : Alert("OutCarte: Elément introuvable.");
		}
}

function CarteGame(position){
	//fonction gérant les règles du jeu de carte
	var MaxCarte=4;					//Nombre de paires présentes dans le jeu
	Click1=Pioche[position-1];		//récupère le nom de l'image sans son extension dans la case du tableau Pioche correspondante

	if (CarteRetournee.length<MaxCarte) {		//Cas 1: Pas de victoire ne de défaite, le jeu continu.

		$('#Dos'+position).hide();		//cache le dos de la carte
		$('#I'+position).show();		//remplace le dos par le recto de la carte (l'image)
		
		if (Click1=="herisson"){	//compare le nom récupéré avec le nom de l'image perdante
			for (i=0; CarteRetournee.length<MaxCarte; i++){			//On remplit la condition empêchant de continuer le jeu ( talbeau "CarteRetournee" plein)
				CarteRetournee.push("Echec");
			}
			for (i=1; i<10; i++){
				$("#Dos"+i).hide();					//on efface tous les dos de carte
				$("#I"+i).show();					//on affiche toutes les images
			}
		}
		else {							//Commandes réalisées quand la carte sélectionnée n'induit pas un game over
			if (paire==1 && Click1==Click2){		//si la carte retournée correspond à la carte retourné juste avant
				CarteRetournee.push(Click1);	//le nom commun aux deux images de la paire est envoyé dans le tableau
				paire=0;
			}
			else if (paire==1 && Click1!=Click2){			//Si une imge différente de celle sélectionnée est déjà affichée
				ErreurCartes= setTimeout(FaussePaire, 2000, LastCard, position);
				paire=0;				//réinitialisation des variables
				LastCard="";
			}
				else {						//Si aucune paire n'est particiellement dévoilée
					LastCard=position;		//on laisse l'image sélectionnée affichée et on garde le début d'appariment en mémoire dans plusieurs variables
					Click2=Click1; 
					paire=1;
				}
		}
	}
	if (CarteRetournee.length==MaxCarte && CarteRetournee[3]!="Echec") {		//Cas 2: Le jeu est fini et le joueur est vainqueur
		//si le tableau est complété au maximum défini et on n'y trouve pas de trace de remplissage forcé par la carte perdante
		alert("Victoire!");
		$("#Fin").show();
	}
	else if (CarteRetournee.length==MaxCarte && CarteRetournee[3]=="Echec") {	//cas 3: Le jeu est fini et le joueur est perdant
		alert("Vous avez perdu la partie. Voulez-vous réessayer?");
		$("#Fin").show();
	}
} 

function FaussePaire (AncienneCarte, NewCarte) {
	//Fonction à retardement appelée quand deux cartes sélectionnées ne correspondent pas à une paire
	//Les paramètres correspondent à des variables de la fonction ci-dessus: AncienneCarte=LastCard et NewCarte=position  
	$('#I'+AncienneCarte).hide();	//On cache l'image qui avait été affichée au tour précédent
	$('#I'+NewCarte).hide();		//on cache l'image sélectionnà au tour actuel
	$("#Dos"+AncienneCarte).show();
	$("#Dos"+NewCarte).show();
}

function ImgSelection(caseImg){
	var Click0=Pioche[caseImg-1];
	var i=0;		//variable servant dans la boucle qui suit
	while (CarteRetournee.length>0 && i<CarteRetournee.length){		//Les conditions sont testées sur la longueur du tableau si il n'est pas vide
		if (Click1==CarteRetournee[i] || Click0==LastCard){		//Conditions: on compare l'image ayant lancée la fonction aux paires trouvées et à la dernière carte sélectionnée
			alert("Cette image a déjà été retournée!"); break;		//si la carte ayant lancé la fonction est l'une de celle citées ci-dessus: message d'erreur et sortie de fonction
		}
		i++;		//incrémentation de la variable utilisée dans la boucle
	}
}

// ----------------------- TEST DE PERSONNALITE --------------------------

//les scores pour chaque profil
var carre = 0;
var standard = 0;
var chelou = 0;
var qcmQ = {}; //on se servira de cette variable pour y stocker temporairement une des variables ci-dessous
//ce sont des variables "object", une pour chaque question; elles contiennent différentes propriétés: l'énoncé et les trois options données à l'utilisateur
var qcmQ1 = {
	enonce:"Votre voiture idéale serait plutôt...",
	rep1:"Discrète, avec des vitres teintées.",
	rep2:"Pas trop chère, mais pas moche non plus.",
	rep3:"Une décapotable qui va vite!"
};
var qcmQ2 = { 
	enonce:"Vous êtes plutôt...",
	rep1:"Organisé dans votre travail et assez peu enclin à vous laisser aller.",
	rep2:"Flexible. L'organisation passe après l'adaptation.",
	rep3:"Eccentrique. En tout cas, c'est comme ça que les autres appellent votre indépendance et vos choix originaux."
};
var qcmQ3 = { 
	enonce:"Laquelle de ces couleurs préférez-vous?",
	rep1:"Blanc",
	rep2:"Bleu clair",
	rep3:"Rose flash"
};
var qcmQ4 = { 
	enonce:"Vous êtes sur le point de quitter un arrêt de tram, quand vous apercevez une jeune fille courir dans votre direction. Que faites-vous?",
	rep1:"Vous continuez d'avancer, vous avez des horaires étroits après tout.",
	rep2:"Vous délayez votre départ de quelques secondes pour laisser la damoiselle monter.",
	rep3:"Vous ne l'aviez pas remarquée, comme un grand savant Américain l'a une fois dit: \"eyes on the road\"."
};
var qcmQ5 = { 
	enonce:"Vous avez le choix entre plusieurs plans pour le week-end, vous préférez:",
	rep1:"Un week-end au calme, juste vous, votre pizza et - soyons fous - votre télé.",
	rep2:"Un repas entre amis, en comité raisonnable.",
	rep3:"Participer à la gay pride la plus proche (grosse fête à l'horizon!)"
};
var qcmQ6 = { 
	enonce:"Sur une ligne de rails à votre droite se trouve un autre tram. Il s'apprête à s'embrancher sur la ligne sur laquelle vous vous trouvez.",
	rep1:"Vous accélèrez pour éviter que le tram ne se place devant vous. Pas de temps à perdre.",
	rep2:"Vous ralentissez afin de laisser votre collègue passer devant vous.",
	rep3:"Vous ajustez votre vitesse pour qu'il y ait collision. Cette vie commence à vous soûler, il est temps de prendre une retraite anticipée!"
};
var qcmQ7 = { 
	enonce:"Vous recevez une énorme somme d'argent de la part d'un tiers mystérieux...",
	rep1:"Vous donnez tout à la charité.",
	rep2:"C'est une lourde responsabilité, vous décidez d'en parler à vos amis.",
	rep3:"Vous cachez tout dans un lieu sûr, éloigné de tous..."
};

//ces variables seront utilisées pour l'affichage des résultats
var texteCarre = "<h2 id='qcmTitre'>Carré</h2><br><img src='../images/tours.jpg'><br>Vous ressemblez beaucoup au tram de Tours. Très carré et organisé, peut-être un peu trop. Vous voyez le monde en noir et blanc et votre manque de flexibilité vous fait parfois apparaitre comme antipathique auprès de vos proches. Vous aimez tout maîtriser et aller au bout des choses. D'un autre côté, vous avez aussi un esprit très critique qui vous permettra immédiatement de comprendre que ce test se paie totalement votre tête sans le moindre scrupule. De rien!";
var texteStandard = "<h2 id='qcmTitre'>Normal</h2><br><img src='../images/strasbourg.jpg'><br>Vous êtes le tram de Strasbourg. Sincères condoléances (c'est gratuit). Ceci étant dit, vous vous adaptez très facilement à votre environnement et à ce qu'il attend de vous. Vous êtes facile à vivre, sociable et gentil...peut être trop d'ailleurs. Aucun ne pourrait dire que vous n'avez pas de personnalité, ou que vous vous faites marcher sur les pieds. Nous espérons pour vous que ce n'est pas une expérience trop douloureuse, auquel cas l'herbe ne nous parait vraiment pas verte de votre côté de la barrière. Hourra le voisinage.";
var texteChelou = "<h2 id='qcmTitre'>Chelou</h2><br><img src='../images/montpellier.jpg'><br>Eh ben voilà, je pense que tout est dit, on peut tous rentrer chez nous... Vous trouverez les résultats sur le bureau d'Emin s'ils n'apparaissent pas assez clairement dans votre petite tête, il les a gentiment laissés avant de rentrer. Ah, et si vous pouviez mettre l'alarme en partant, ce serait cool l'ami. Ciao!";
var texteSep = "<h2 id='qcmTitre'><hr>Sinon, vous êtes aussi...</h2><br>";

var qcmTirage = [qcmQ1,qcmQ2,qcmQ3,qcmQ4,qcmQ5,qcmQ6,qcmQ7]; //tableau avec le nom de chaque variable, on ira piocher au hasard un des éléments du tableau

function qcmPrep(qcmRecommence) { 	//cette fonction s'exécute au chargement de la page, mais aussi lorsque l'on clique sur le bouton "Recommencer"
	if (qcmRecommence == 1) {		//si ce paramètre est égal à un, c'est que l'utilisateur a cliqué sur le bouton "Recommencer". donc...
		if (document.question == undefined) location.reload(); 	//si le formulaire n'existe plus à cause de la fonction $("#qcmFormulaire").empty(); dans qcmResultats()
		else {													//sinon, l'utilisateur veut recommencer le questionnaire en cours de route, il faut donc réinitialiser certaines choses et non pas toute la page
			document.question.reset();
			carre = 0;
			standard = 0;
			chelou = 0;
			qcmTirage = [qcmQ1,qcmQ2,qcmQ3,qcmQ4,qcmQ5,qcmQ6,qcmQ7];
			document.getElementById('qcmSuiv').value = "Suivant"; //si jamais l'utilisateur réinitialise lorsqu'il se trouve à la dernière question, où le bouton change pour dire "Résultats"
		}
	}
	document.getElementById('qcmSuiv').disabled = true; //on grise le bouton "Suivant" afin d'empêcher de passer à l'énoncé suivant sans avoir donné de réponse (voir événements "onclick" des boutons radio)

	var qcmAleatoire = Math.floor(qcmTirage.length*Math.random());	//une position aléatoire dans le tableau, storée dans une variable car je l'utilise plusieurs fois:
	qcmQ = qcmTirage[qcmAleatoire]; 								//on sélectionne la variable qcmQx dans le tableau
	qcmTirage.splice(qcmAleatoire,1); 								//on supprime la variable sélectionnée dans le tableau pour qu'elle ne soit pas sélectionnée 2 fois

	//on affecte les différentes chaines de textes de qcmQ dans des emplacements spécifiques sur la page
	document.getElementById("qcmEnonce").innerHTML = qcmQ.enonce;
	document.getElementById("rep1").innerHTML = qcmQ.rep1;
	document.getElementById("rep2").innerHTML = qcmQ.rep2;
	document.getElementById("rep3").innerHTML = qcmQ.rep3;
}

function qcmCoche() { 										//fonction déclenchée lorsqu'on coche un des boutons radio
	document.getElementById('qcmSuiv').disabled = false;	//l'utilisateur a choisi une option, on dégrise le bouton pour qu'il puisse passer à l'énoncé suivant
	for (i=0;i<3;i++) {
		if (question.rep[i].checked == true) {									//si le bouton numéro i est coché
			document.getElementById("rep"+(i+1)).style.fontWeight = "bold";		//alors on met le texte adjacent en gras
		} else document.getElementById("rep"+(i+1)).style.fontWeight = "normal";//sinon le texte adjacent à un bouton non-coché doit être (ou redevenir) normal
	}
}

function qcmReponse() { //fonction qui s'exécute lorsqu'on clique sur le bouton "suivant"
	if (document.getElementById('qcmSuiv').value == "Résultats") qcmResultats(); //si le bouton dit "Résultats" (voir fin de qcmSuivant()) il faut passer à la fonction appropriée
	else qcmSuivant(); 															//sinon on exécute la fonction ci-dessous, pour passer à la question suivante

	function qcmSuivant() {
		//on vérifie quelle réponse l'utilisateur a coché et on ajoute un point au score approprié
		if (question.rep[0].checked == true) carre++;
		else if (question.rep[1].checked == true) standard++;
		else if (question.rep[2].checked == true) chelou++;
		for (i=0;i<3;i++) {
			document.getElementById("rep"+(i+1)).style.fontWeight = "normal"; //une des lignes est en gras à cause de qcmCoche(), on remet tout en normal
		}
		qcmAleatoire = Math.floor(qcmTirage.length*Math.random()); 
		qcmQ = qcmTirage[qcmAleatoire]; 	//même principe que dans la fonction qcmPrep()
		qcmTirage.splice(qcmAleatoire,1); 	
		document.question.reset(); 			
		document.getElementById('qcmSuiv').disabled = true; //on grise le bouton de nouveau
		//comme au dessus, on affecte aux même éléments html les nouvelles chaînes de text
		document.getElementById("qcmEnonce").innerHTML = qcmQ.enonce;
		document.getElementById("rep1").innerHTML = qcmQ.rep1;
		document.getElementById("rep2").innerHTML = qcmQ.rep2;
		document.getElementById("rep3").innerHTML = qcmQ.rep3;
		
		if (qcmTirage.length < 1) document.getElementById('qcmSuiv').value = "Résultats"; //s'il n'existe pas d'énoncé après celui-là, on passera au résultat
	}

	function qcmResultats() { //cette fonction se charge de l'affichage des résultats
		//pour la toute dernière question
		if (question.rep[0].checked == true) carre++;
		else if (question.rep[1].checked == true) standard++;
		else if (question.rep[2].checked == true) chelou++;
		
		document.getElementById('qcmSuiv').disabled = true;
		document.getElementById("qcmTitre").innerHTML = "Vous êtes...";
		$("#qcmFormulaire").empty(); //fonction Jquery pour "vider" la div #qcmFormulaire
		
		if ((carre > standard) && (carre > chelou)) { 	//si le score "carré" est strictement supérieur aux deux autres...
			document.getElementById("qcmFormulaire").innerHTML = texteCarre;
		} else if ((standard > carre) && (standard > chelou)) { //on vérifie les mêmes choses pour "standard" et pour "chelou"
			document.getElementById("qcmFormulaire").innerHTML = texteStandard;
		} else if ((chelou > carre) && (chelou > standard)) {
			document.getElementById("qcmFormulaire").innerHTML = texteChelou;
		}
		//ici on traite les égalités
		else if ((carre == standard) && (carre > chelou)) {	//si les scores carré et standard sont égaux ET que l'un des deux est supérieur au troisième
			document.getElementById("qcmFormulaire").innerHTML = texteCarre + texteSep + texteStandard; //texteSep est un séparateur (voir son contenu)
		} else if ((carre == chelou) && (carre > standard)) { //ainsi de suite
			document.getElementById("qcmFormulaire").innerHTML = texteCarre + texteSep + texteChelou;
		} else if ((standard == chelou) && (standard > carre)) {
			document.getElementById("qcmFormulaire").innerHTML = texteStandard + texteSep + texteChelou;
		}
	}
}

// ----------------------- COURSE DE TRAM --------------------------
function courseFondSelect() {
	var courseFonds = ["fond1","fond2","fond3"];
	var courseFondActuel = courseFonds[Math.floor(courseFonds.length*Math.random())];
	document.getElementById("courseFond").style.backgroundImage = "url('../images/" + courseFondActuel + ".png')";
}

function courseCommence(tramSelect) { //fonction qui s'éxecute lors de la sélection d'un tram, le paramètre tramSelect dépend du tram sur lequel on a cliqué
	
	var classContour = document.getElementsByClassName("contourTram");
	for (i = 0; i < classContour.length; i++) { 	//boucle servant à masquer chaque élément ayant la class contourTram
		classContour[i].style.display = "none"; 		//classContour[i] = l'élément numéro i ayant la class contourTram 
	}												//faire disparaitre ces éléments est doublement important puisqu'ils sont responsables du déclenchement de cette fonction, et il est important que la fonction ne soit déclenchée qu'une seule fois
	document.getElementById("divWinWrap").style.display = "none";
	
	var courseMusique = new Audio("../sons/course_musique.wav"); //musique
	//effets sonores
	var son321 = new Audio("../sons/course_321.wav");
	var sonGo = new Audio("../sons/course_go.wav");
	var sonTadah = new Audio("../sons/course_tadah.wav");
	var sonClap = new Audio("../sons/course_clap.wav");
	var sonAhhh = new Audio("../sons/course_ahhh.wav");
	var sonPhoto = new Audio("../sons/course_photo.wav");
	
	var herisson = document.getElementById("compteChiffre");
	var decompte = 3;
	var herissonAnim1 = setInterval(herissonAnim1fonc,1); 	//on exécute la fonction herissonAnim1fonc à un intervalle de 1 millisecondes
	function herissonAnim1fonc() {							//fonction responsable de l'animation du hérisson
		var positionHerisson = $("#compteChiffre").position().top;	//j'utilise du Jquery plutôt que du css car avec le css on a toujours le "px" qui suit
			if (positionHerisson<268) clearInterval(herissonAnim1);	//si le hérisson a atteint la position désirée, on stoppe l'intervalle
			else { 													//sinon, on bouge le hérisson de 2 pixels à chaque intervalle
				positionHerisson = positionHerisson-2;
				herisson.style.top = positionHerisson + "px";
			}
		}
			
	var courseCompteur = setInterval(courseCompte, 1000);
	
	function courseCompte() {
		if (decompte != 0) { //si le décompte n'est pas à zéro
			herisson.style.color = "red"; //on (re)met le texte en rouge
			herisson.style.textShadow = "0px 0px 2px"; //effet lumineux sur le texte
			herisson.innerHTML = parseInt(decompte);
			son321.play();
			decompte--;
			
				setTimeout(function() { 					//cette fonction-là existe purement à des fins esthétiques
					if (decompte != 0) { 					//si le décompte n'est pas à zéro
						herisson.style.color = "#810000"; 	//couleur plus sombre
						herisson.style.textShadow = "none"; //on enlève l'effet lumineux
						herisson.innerHTML = parseInt(decompte); //on préaffiche le chiffre qui va venir
					} else {  								//sinon, si le décompte est à zéro
						herisson.style.color = "#7b8d00";	//idem, couleur plus sombre que la normale
						herisson.style.textShadow = "none";	//etc...
						herisson.style.paddingTop = "34px";
						herisson.style.fontSize = "22px";
						herisson.innerHTML = "Partez!"; 	//on préaffiche "Partez!"
					}
				},500); //cette fonction s'exécute tous les demi-intervalles, et préaffiche la valeur du décompte, en plus sombre (pour 2 et 1, 3 est affiché en sombre par défaut)
		} 
		else { 	//sinon, si le décompte est à zéro
					//on change quelques règles css
			herisson.style.color = "#ddfa1e";
			herisson.style.textShadow = "0px 0px 2px";
			sonGo.play(); 					//on utilise la fonction play() sur le son que l'on désire jouer
			clearInterval(courseCompteur); 	//on stoppe l'intervalle
			coursePartez(); 				//on exécute la fonction d'après
			
			//et là, on anime encore le hérisson pour qu'il ressorte de l'écran
			setTimeout(function() { 							//function() = fonction sans nom, on va pas la réutiliser
				var herissonAnim2 = setInterval(function() { 	//idem
				var positionHerisson = $("#compteChiffre").position().top; //on rerécupère la position actuelle
					if (positionHerisson>398) clearInterval(herissonAnim2); //le reste est pareil que herissonAnim1fonc() sauf que le hérisson se déplace vers le bas et d'1 pixel au lieu de 2
					else {
						positionHerisson++;
						herisson.style.top = positionHerisson + "px";
					}
				},1); 	//donc ça c'est l'intervalle, on bouge le herisson de 1 pixel jusqu'à ce que la position soit atteinte
			},500); 	//mais on exécute cet intervalle 500 millisecondes après que "Partez!" se soit affiché, pour qu'on ait le temps de le lire
		}
	}
	
	function coursePartez() { //fonction qui se charge de la course elle-même, et qui contient les fonctions se chargeant respectivement de la fin de la course et de l'affichage des résultats
		courseMusique.play(); //en avant la musique
		//un tas de variables, avec...
		//des ID css 
		var idTramA = document.getElementById("courseTramA");
		var idTramB = document.getElementById("courseTramB");
		var idTramC = document.getElementById("courseTramC");
		var idHerbe = document.getElementById("courseHerbe");
		var idFond = document.getElementById("courseFond");
		var idLigne = document.getElementById("courseLigne");
		var idConteneur = document.getElementById("courseConteneur");
		//la position de base de chaque tram, encore avec du Jquery
		var positionA = $("#courseTramA").position().left;
		var positionB = $("#courseTramB").position().left;
		var positionC = $("#courseTramC").position().left;
		var positionHerbe = $("#courseHerbe").position().left;
		var positionFond = $("#courseFond").position().left;
		var positionLigne = $("#courseLigne").position().left;
		//j'utiliserais ces trois variables comme des comptes à rebours. ex: quand picknewA atteint zéro, la variable incrementA prend une nouvelle valeur aléatoire
		//je préfère que l'on ne prenne pas de nouvelle valeur à chaque intervalle, le mouvement des trams serait saccadé et ils auraient moins de chances de se démarquer
		var picknewA = 0;
		var picknewB = 0;
		var picknewC = 0;
		//on insérera un chiffre aléatoire dans ces trois variables, qui sera additionné à la position du tram correspondant
		var incrementA = 0;
		var incrementB = 0;
		var incrementC = 0;
		var courseFin = 0; 		//on mettra 1 dans cette var pour indiquer que la course est finie
		var tramGagnant = []; 	//on mettra les gagnants ici, et on vérifiera s'il y a égalité
		var coursePause = 0; 	//on mettra 1 dans cette var pour "interrompre" les intervalles ci-dessous
		var courseTimerA = setInterval(courseGoA, 40);
		var courseTimerB = setInterval(courseGoB, 40);
		var courseTimerC = setInterval(courseGoC, 40);
		
		var herbAnim = setInterval(foncHerbe, 3);
		var fondAnim = setInterval(foncFond, 20);
		
		setTimeout(function() {
			var lignAnim = setInterval(foncLigne, 3);
		},7000); 				//executer cet intervalle dans 7 secondes

		function courseGoA() { 						//fonction responsable du déplacement du tram A
			if (positionA>950) clearInterval(courseTimerA); //si le tram a atteint la position désirée (en dehors de l'écran) on stoppe tout
			if (positionA-positionLigne >= -1036) { 	//si la position du tram moins la position de la ligne = cette valeur, alors ça veut dire que le tram touche la ligne. je suis allé trouver cette valeur manuellement car je suis nul en maths
				if(courseFin != 1) { 					//si la course n'est pas déjà terminée
					courseFinish();						//on exécute la fonction qui se charge de la fin de la course
				}
			}
			if (picknewA==0) { 								//si le petit compte à rebours est à zéro
				incrementA = Math.floor(Math.random() * 4) + 1;	//on store une nouvelle valeur aléatoire dans cette var. cette formule donne un entier pouvant aller de 1 à 4
				picknewA = 10; 									//et on remet le compteur à 10
			} else if (courseFin==1) {			//si la course est déjà finie
				  if (coursePause == 1) return 		//si la course est en pause, ne rien faire
				  else incrementA = 20;				//sinon le tram sort vite de l'écran
			} else {						//sinon, si la course n'est pas finie...
				picknewA--; 				//...on continue de diminue le compte à rebours
			}
			positionA = positionA + incrementA;	//la nouvelle position sera la position actuelle + la valeur aléatoire qui a été piochée
			idTramA.style.left = positionA + "px";
		}
//les deux fonctions ci-dessous sont identiques à la précédente, sauf pour B et C au lieu de A, et des valeurs différentes pour mes comparaisons loufoques avec la position de la ligne d'arrivée
		function courseGoB() { //fonction responsable du déplacement du tram B
			if (positionB>950) clearInterval(courseTimerB);
			if (positionB-positionLigne >= -1084) {
				if(courseFin != 1) {
					courseFinish();
				}
			}
			if (picknewB==0) {
				incrementB = Math.floor(Math.random() * 4) + 1;
				picknewB = 10;
			} else if (courseFin==1) {
				if (coursePause == 1) return
				else incrementB = 20;
			} else {
				picknewB--;
			}
			positionB = positionB + incrementB;
			idTramB.style.left = positionB + "px";
		}

		function courseGoC() { //fonction responsable du déplacement du tram C
			if (positionC>950) clearInterval(courseTimerC);
			if (positionC-positionLigne >= -1132) {
				if(courseFin != 1) {
					courseFinish();
				}
			}
			if (picknewC==0) {
				incrementC = Math.floor(Math.random() * 4) + 1;
				picknewC = 10;
			} else if (courseFin==1) {
				if (coursePause == 1) return
				else incrementC = 20;
			} else {
				picknewC--;
			}
			positionC = positionC + incrementC;
			idTramC.style.left = positionC + "px";
		}


		function foncHerbe() { //fonction pour le défilement de l'herbe
			if (courseFin == 1) {
				clearInterval(herbAnim);
			} else {
				if (positionHerbe == -120) { //120px = la largeur de la texture de l'herbe
					positionHerbe = 0;
				}
				positionHerbe--; //on réduit de 1 la valeur correspondant à la position (= déplacement d'un pixel vers la gauche)
				idHerbe.style.left = positionHerbe + "px";
			}
		}
		
		function foncFond() { //fonction pour le défilement du fond
			if (courseFin == 1) {
				clearInterval(fondAnim);
			} else {
				if (positionFond == -256) {
					positionFond = 0;
				}
				positionFond--;
				idFond.style.left = positionFond + "px";
			}
		}
		
		function foncLigne() { //fonction pour le déplacement de la ligne d'arrivée
			if (courseFin == 1) {
				clearInterval(); //rien entre parenthèse ça marche, si je met "lignAnim" ça fonctionne pas... peut-être parce que le setInterval est à l'intérieur d'un setTimeout
			} else {
				positionLigne--;
				idLigne.style.left = positionLigne + "px";
			}
		}

		function courseFinish() { //fonction se chargeant de la fin de la course
			if (courseFin == 1) return //pour éviter que la fonction soit exécutée plusieurs fois
			courseFin = 1;
			courseMusique.pause(); 	//stop la musique
			coursePause = 1;		//oh les trams on arrête de bouger
			
			//ici on vérifie toutes les issues possibles
			if ((positionA-positionLigne >= -1036)&&(positionB-positionLigne >= -1084)&&(positionC-positionLigne >= -1132)) { //dans l'éventualité d'une égalité à 3 (si les trois trams touchent la ligne)
				tramGagnant[0] = "A";
				tramGagnant[1] = "B";
				tramGagnant[2] = "C";
			} else if ((positionA-positionLigne >= -1036)&&(positionB-positionLigne >= -1084)) { //s'il y a égalité entre les tram A et B
				tramGagnant[0] = "A";
				tramGagnant[1] = "B";
			} else if ((positionA-positionLigne >= -1036)&&(positionC-positionLigne >= -1132)) { //s'il y a égalité entre les tram A et C
				tramGagnant[0] = "A";
				tramGagnant[1] = "C";
			} else if ((positionB-positionLigne >= -1084)&&(positionC-positionLigne >= -1132)) { //s'il y a égalité entre les tram B et C
				tramGagnant[0] = "B";
				tramGagnant[1] = "C";
			} else if ((positionA-positionLigne >= -1036)) { //si seul le tram A touche la ligne
				tramGagnant[0] = "A";
			} else if ((positionB-positionLigne >= -1084)) { //si seul le tram B touche la ligne
				tramGagnant[0] = "B";
			} else if ((positionC-positionLigne >= -1132)) { //si seul le tram C touche la ligne
				tramGagnant[0] = "C";
			}
			
			sonPhoto.play();		//clic
			idConteneur.style.filter = "grayscale(100%) brightness(250%)"; //on applique des filtres css au conteneur: noir et blanc et +150% de luminosité pour l'effet de "flash"
			var j = 250; //on va se servir de cette var pour réduire progressivement la luminosité
			var coursePhoto = setInterval(function() {
				if (j==100) clearInterval(coursePhoto); //si la luminosité est retombée à 100%, on arrête
				else {									//sinon on la fait descendre progressivement...
					j-=2 								//façon courte de dire "j = j - 2"
					idConteneur.style.filter = "grayscale(100%) brightness("+j+"%)";
				}
			},2);
			
			setTimeout(function() { 					//au bout de 2 secondes...
				idConteneur.style.filter = "none"; 		//on enlève les filtres
				coursePause = 0; 						//les trams peuvent bouger
				courseResultats(tramGagnant) 			//on transmet le paramètre à la fonction d'après
			},2000);
		}
		function courseResultats(tramGagnant) { //fonction se chargeant de l'affichage des résultats
			herisson.style.paddingTop = "17px";
			herisson.style.margin = "0";
			herisson.innerHTML = "<img src='../images/icone_reset.png' style='cursor:pointer; max-width: 60px' onClick='location.reload()'/>"; //recharger toute la page pour recommencer
			var herissonAnim1 = setInterval(herissonAnim1fonc,1); //on réutilise l'animation du hérisson qui surgit
			
			if (tramGagnant.length == 3) { //s'il y a eu une incroyable égalité à 3
				document.getElementById("divWinWrap").style.left = "152px";
				var texteWin1 = "Incroyable! Tout le monde gagne!";
				var texteWin2 = "Comme ça, pas de jaloux.";
				sonClap.play();
			} else if (tramGagnant.length == 2) { //s'il y a eu deux gagnants
				document.getElementById("divWinWrap").style.left = "149px";
				document.getElementById("divWinWrap").style.width = "600px";
				var texteWin1 = "Égalité entre les trams <img class='iconeTrams' src='../images/icone_"+tramGagnant[0]+".png'> et <img class='iconeTrams' src='../images/icone_"+tramGagnant[1]+".png'>!";
				
				for (i = 0 ; i < tramGagnant.length ; i++) { //s'il y a eu une égalité à 2
					if (tramGagnant[i] == tramSelect) { //si un des trams gagnants est le tram sélectionné
						var texteWin2 = "Bravo!";
					}
				}
				if (texteWin2 === undefined) { //si le texte ne dit rien (il ne dit pas "bravo!")
					var texteWin2 = "Dommage...";
					sonAhhh.play();
				} else { //j'aurais pu mettre ça dans la boucle au dessus mais jouer des sons dans un boucle ça fait sale je trouve
					sonTadah.play();
					sonClap.play();
				}
					
			} else { 								//sinon, s'il n'y a qu'un seul gagnant
				var texteWin1 = "Le tram <img class='iconeTrams' src='../images/icone_"+tramGagnant+".png'> a gagné!";
				document.getElementById("divWinWrap").style.left = "254px";
				if (tramGagnant[0] == tramSelect) {	//...et qu'il s'agit du tram sélectionné
					sonTadah.play();
					sonClap.play();
					var texteWin2 = "Bravo!";
				} else { 							//sinon, si le tram gagnant n'est pas celui qui a été sélectionné
					sonAhhh.play();
					var texteWin2 = "Dommage...";
				}
			}
			document.getElementById("divWinWrap").style.display = "block"; 	//on réaffiche la div
			document.getElementById("spanWin1").innerHTML = texteWin1;		//on affecte à chaque span le texte approprié
			document.getElementById("spanWin2").innerHTML = texteWin2;
		}
	}
}