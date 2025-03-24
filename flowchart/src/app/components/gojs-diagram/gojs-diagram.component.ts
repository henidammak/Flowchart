import { HtmlParser } from '@angular/compiler';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as go from 'gojs';
import { Subscription } from 'rxjs';
import { CmdStage } from 'src/Models/CmdStage_Task';
import { Composite_Task } from 'src/Models/CompositeTask';
import { End_Task } from 'src/Models/End_Task';
import { Sleep_Task } from 'src/Models/Sleep_Task';
import { Start_Task } from 'src/Models/Start_Task';
import { DiagramSelectionService } from 'src/Services/diagram-selection.service';

@Component({
  selector: 'app-gojs-diagram',
  templateUrl: './gojs-diagram.component.html',
  styleUrls: ['./gojs-diagram.component.css'],
})
export class GojsDiagramComponent implements AfterViewInit {
  private myDiagram: go.Diagram | null = null;
  private myPalette: go.Palette | null = null;
  private saveSubscription!: Subscription;
  private startSubscription!: Subscription;
  task: any = {}; // Stocke le dictionnaire recu par le moadal ici
  ////////
  constructor(private selectionService: DiagramSelectionService) {}
  //////////
  // cmdstage!: CmdStage;

  ngAfterViewInit(): void {
    const diagramDiv = document.getElementById('myDiagramDiv');
    if (diagramDiv) {
      this.initDiagram();
    } else {
      console.error("Erreur: 'myDiagramDiv' n'existe pas.");
    }
  }

  initDiagram(): void {
    //création de l'objet mydiagram
    const $ = go.GraphObject.make;
    this.myDiagram = $(go.Diagram, 'myDiagramDiv', {
      'undoManager.isEnabled': true,
      'themeManager.changesDivBackground': true, //prend le couleur de l'attribut div du table themeManager
      // 'themeManager.currentTheme': 'light' // initial theme
    });

    // la grille arriere plan du diagramme
    this.myDiagram.grid = $(
      go.Panel,
      'Grid',
      { gridCellSize: new go.Size(40, 40) }, // Taille des cellules
      $(go.Shape, 'LineH', { stroke: 'lightgray', strokeWidth: 0.5 }), // Lignes horizontales fines
      $(go.Shape, 'LineV', { stroke: 'lightgray', strokeWidth: 0.5 }), // Lignes verticales fines

      // Lignes plus épaisses toutes les 5 cellules
      $(
        go.Shape,
        'LineH',
        { stroke: '#E0E0E0', strokeWidth: 0.3 },
        new go.Binding('interval', '', () => 5)
      ),
      $(
        go.Shape,
        'LineV',
        { stroke: '#E0E0E0', strokeWidth: 0.3 },
        new go.Binding('interval', '', () => 5)
      )
    );

    ////création de l'objet myPalette
    this.myPalette = go.GraphObject.make(go.Palette, {
      'undoManager.isEnabled': true,
      'themeManager.changesDivBackground': true,
      contentAlignment: go.Spot.Top, // Aligner le contenu en haut
    });

    ///////////////

    this.myDiagram.addDiagramListener('Modified', (e) => {
      const button = document.getElementById('SaveButton') as HTMLButtonElement;
      console.log(button);
      if (button) button.disabled = !this.myDiagram?.isModified;
      const idx = document.title.indexOf('*');
      console.log(idx);
      const idt = document.title;
      console.log(idt);

      if (this.myDiagram?.isModified) {
        if (idx < 0) document.title += '*';
        console.log(document.title);
      } else {
        if (idx >= 0) document.title = document.title.slice(0, idx);
      }
    });

    // tableau du themeManager pour mydiagram

    this.myDiagram.themeManager.set('light', {
      colors: {
        texte: 'white',
        text: 'black',
        start: 'white',
        step: '#E9E9E9',
        compositeTask: '#c4c4c4',
        conditional: '#81929E',
        end: 'gray',
        comment: '#81929E',
        bgText: '#000',
        link: '#3771B8',
        // link: '#dcb263',
        linkOver: '#cbd5e1',
        div: '#FFFFFF',
        // div: '#ede9e0'
      },
    });

    // tableau du themeManager pour myPalette
    this.myPalette.themeManager.set('light', {
      colors: {
        text: 'black',
        start: 'white',
        step: '#E9E9E9',
        compositeTask: '#c4c4c4',
        conditional: '#81929E',
        end: 'gray',
        comment: '#81929E',
        bgText: '#000',
        link: '#dcb263',
        linkOver: '#cbd5e1',
        div: '#FAFAFB',
      },
    });

    const STROKE_WIDTH = 0; // Épaisseur des bordures des cercles des nœuds.
    const ICON_TOP_MARGIN = 20; // Marge supérieure pour positionner l'image dans le nœud.
    const ICON_DIAMETER = 30; // Taille du cercle où l'image sera placée.
    const ICON_RIGHT_MARGIN = 60;
    const ICON_TOP_SHIFT = -10; // Déplacement vers le haut (valeur négative).

    // je peut l'utiliser si je veut ajouter un theme dark a mon app
    // this.myDiagram.themeManager.set('dark', {
    //   colors: {
    //     text: '#fff',
    //     step: '#414a8d',
    //     conditional: '#88afa2',
    //     comment: '#bfb674',
    //     bgText: '#fff',
    //     link: '#fdb71c',
    //     linkOver: '#475569',
    //     div: '#141e37'
    //   }
    // });

    // appel de la methode qui definis les nodes personalisées
    this.defineFigures();

    // fonction pour la position des node dans le diagramme
    function nodeStyle(node: go.Part) {
      node
        .set({ locationSpot: go.Spot.Center })
        .bindTwoWay('location', 'loc', go.Point.parse, go.Point.stringify); // go.Point.parse est utilisé pour convertir une chaîne de texte en un objet go.Point lorsqu'on charge les données. //go.Point.stringify est utilisé pour convertir un go.Point en une chaîne lorsqu'on sauvegarde les données.
    }

    // Définit le style des formes (sans contour, cliquable).
    function shapeStyle(shape: go.Shape, strokeWidth: number) {
      shape.set({
        strokeWidth: strokeWidth, // Utilise la valeur passée en paramètre
        portId: '', // Définit toute la forme comme un port
        cursor: 'pointer', // Change le curseur en mode pointer (main)
      });
    }

    //Définit la police et la couleur du texte selon le thème.
    function textStyle(textblock: any): void {
      textblock
        .set({ font: ' 11pt Figtree, sans-serif' })
        .theme('stroke', 'text');
    }

    // configuration de la cercle de l'icon wifi
    function strokeStyle(shape: go.Shape): go.Shape {
      return shape
        .set({
          // fill: theme.colors.nodeBackground,
          strokeWidth: STROKE_WIDTH,
        })
        .theme('fill', 'step');
    }

    // l'icon de ma node wifi
    const NodeImage = (iconSource: string): go.Panel =>
      new go.Panel('Spot', {
        alignmentFocus: go.Spot.Top,
        alignment: new go.Spot(
          0,
          0,
          STROKE_WIDTH / 2 + ICON_RIGHT_MARGIN,
          ICON_TOP_MARGIN + ICON_TOP_SHIFT
        ),
      }).add(
        new go.Shape({
          figure: 'Circle',

          desiredSize: new go.Size(ICON_DIAMETER, ICON_DIAMETER),
        }).apply(strokeStyle),
        new go.Picture({
          // source: 'assets/css/wifi.png',
          source: iconSource,
          scale: 0.05,
        })
      );

    // definition des nodes du diagram
    // define the Node templates for regular nodes signifie que ce modèle est utilisé si un nœud n'a pas de type (category) défini.
    this.myDiagram.nodeTemplateMap.add(
      '', // the default category , '' :
      new go.Node('Auto')
        .apply(nodeStyle) //Crée un nœud avec un layout automatique ('Auto'), ce qui signifie que son contenu sera ajusté à sa forme.
        .add(
          new go.Shape('RoundedRectangle', {
            // si on annule el width et height , la node adapte ca taille selon le taille du texte
            width: 150,
            height: 100,
            fromLinkable: true,
            toLinkable: true,
            fromSpot: go.Spot.AllSides,
            toSpot: go.Spot.AllSides,

            // fromLinkable: true → Peut envoyer des connexions (Link).
            // toLinkable: true → Peut recevoir des connexions.
            // fromSpot: go.Spot.AllSides → Peut envoyer des liens depuis n'importe quel côté.
            //toSpot: go.Spot.AllSides → Peut recevoir des liens de n'importe quel côté.
          })
            .apply((shape) => shapeStyle(shape, 0))
            .theme('fill', 'step'), //utilise le couleur du attribut "step" selon theme choisi ,(déclaration des themes au dessus)
          new go.TextBlock({
            //configuration du texte ecrivé  dans la node de category ''
            margin: 12,
            maxSize: new go.Size(150, NaN), //Limite la largeur à 160 pixels, mais la hauteur est illimitée (NaN).
            wrap: go.Wrap.Fit, // Active le retour à la ligne si le texte dépasse la largeur maximale.
            editable: true, // Le texte peut être modifié par l'utilisateur.
            alignment: new go.Spot(0.5, 0.8),
          })
            .apply(textStyle)
            .bindTwoWay('text'),
          NodeImage('assets/css/wifi.png') // l'icon de la node
        )
    );
    this.myDiagram.nodeTemplateMap.add(
      'Start',
      new go.Node('Auto').apply(nodeStyle).add(
        new go.Shape('Circle', { fromLinkable: true, stroke: 'gray' })
          .apply((shape) => shapeStyle(shape, 2))
          .theme('fill', 'start'),
        new go.TextBlock({
          margin: new go.Margin(5),
          stroke: 'white',
          font: 'bold 7px sans-serif',
        })
          // .apply(textStyle)
          .bind('text') //Liaison simple (bind('text')) → Peut afficher un texte dynamique, mais pas bidirectionnellement.
      )
    );

    this.myDiagram.nodeTemplateMap.add(
      'End',
      new go.Node('Auto').apply(nodeStyle).add(
        new go.Shape('Circle', { toLinkable: true })
          .apply((shape) => shapeStyle(shape, 0))
          .theme('fill', 'end'),
        new go.TextBlock({
          margin: new go.Margin(6),
          stroke: 'gray',
          font: 'bold 8px sans-serif',
        })
          // .apply(textStyle)
          .bind('text')
      )
    );
    // ce composant et un composant personalisée construis par la fonction defineFigure et appelé ici pour etre affiché dans le diagramme
    this.myDiagram.nodeTemplateMap.add(
      'Conditional',
      new go.Node('Auto').apply(nodeStyle).add(
        new go.Shape('Conditional', { fromLinkable: true, toLinkable: true })
          .apply((shape) => shapeStyle(shape, 0))
          .theme('fill', 'conditional'),
        new go.TextBlock({
          margin: 8,
          maxSize: new go.Size(160, NaN),
          wrap: go.Wrap.Fit,
          textAlign: 'center',
          editable: true,
          stroke: 'white',
        })
          // .apply(textStyle)
          .bindTwoWay('text')
      )
    );

    this.myDiagram.nodeTemplateMap.add(
      'Comment',
      new go.Node('Auto').apply(nodeStyle).add(
        new go.Shape('File', { strokeWidth: 3 })
          .theme('fill', 'div')
          .theme('stroke', 'comment'),
        new go.TextBlock({
          font: '9pt Figtree, sans-serif',
          margin: 8,
          maxSize: new go.Size(200, NaN),
          wrap: go.Wrap.Fit,
          textAlign: 'center',
          editable: true,
        })
          .theme('stroke', 'bgText')
          .bindTwoWay('text')
        // no ports, because no links are allowed to connect with a comment
      )
    );
    this.myDiagram.nodeTemplateMap.add(
      'Sleep',
      new go.Node('Auto').apply(nodeStyle).add(
        new go.Shape('RoundedRectangle', {
          width: 150,
          height: 100,
          fromLinkable: true,
          toLinkable: true,
          fromSpot: go.Spot.AllSides,
          toSpot: go.Spot.AllSides,
        })
          .apply((shape) => shapeStyle(shape, 0))
          .theme('fill', 'step'),
        new go.TextBlock({
          margin: 12,
          maxSize: new go.Size(150, NaN),
          wrap: go.Wrap.Fit,
          editable: true,
          alignment: new go.Spot(0.5, 0.8),
        })
          .apply(textStyle)
          .bindTwoWay('text'),
        NodeImage('assets/css/horloge.png')
      )
    );

    this.myDiagram.nodeTemplateMap.add(
      'Cmd Stage',
      new go.Node('Auto').apply(nodeStyle).add(
        new go.Shape('RoundedRectangle', {
          width: 150,
          height: 100,
          fromLinkable: true,
          toLinkable: true,
          fromSpot: go.Spot.AllSides,
          toSpot: go.Spot.AllSides,
        })
          .apply((shape) => shapeStyle(shape, 0))
          .theme('fill', 'step'),
        new go.TextBlock({
          margin: 12,
          maxSize: new go.Size(150, NaN),
          wrap: go.Wrap.Fit,
          editable: true,
          alignment: new go.Spot(0.5, 0.8),
        })
          .apply(textStyle)
          .bindTwoWay('text'),
        NodeImage('assets/css/terminal.png')
      )
    );

    ///tache compose////
    this.myDiagram.nodeTemplateMap.add(
      'CompositeTask', // the default category , '' :
      new go.Node('Auto')
        .apply(nodeStyle) //Crée un nœud avec un layout automatique ('Auto'), ce qui signifie que son contenu sera ajusté à sa forme.
        .add(
          new go.Shape('RoundedRectangle', {
            // si on annule el width et height , la node adapte ca taille selon le taille du texte
            width: 150,
            height: 100,
            fromLinkable: true,
            toLinkable: true,
            fromSpot: go.Spot.AllSides,
            toSpot: go.Spot.AllSides,
          })
            .apply((shape) => shapeStyle(shape, 0))
            .theme('fill', 'compositeTask'), //utilise le couleur du attribut "step" selon theme choisi ,(déclaration des themes au dessus)
          new go.TextBlock({
            //configuration du texte ecrivé  dans la node de category ''
            margin: 12,
            maxSize: new go.Size(150, NaN), //Limite la largeur à 160 pixels, mais la hauteur est illimitée (NaN).
            wrap: go.Wrap.Fit, // Active le retour à la ligne si le texte dépasse la largeur maximale.
            editable: true, // Le texte peut être modifié par l'utilisateur.
            alignment: new go.Spot(0.5, 0.8),
          })
            .apply(textStyle)
            .bindTwoWay('text'),
          new go.Picture() // Ajout de l'icône dynamiquement
            .bind('source', 'icon', (icon) => `assets/css/${icon}`)
            .set({ desiredSize: new go.Size(30, 30) })
            .set({ alignment: new go.Spot(0.5, 0.2) }) // Déplace l'icône vers le haut
        )
    );

    /////////////
    this.myDiagram.addDiagramListener('ObjectSingleClicked', (e) => {
      //addDiagramListener est une méthode de GoJS qui permet d'écouter des événements spécifiques sur le diagramme.
      //'ObjectSingleClicked' est l'événement déclenché lorsqu'un utilisateur clique une seule fois sur un élément du diagramme.
      //(e) => { ... } est une fonction fléchée qui s'exécute à chaque fois que cet événement se produit.
      const part = e.subject.part; //e.subject.part permet d'obtenir la "part" GoJS associée, qui peut être un Node, un Link ou un autre élément du diagramme.
      if (part instanceof go.Node) {
        //Chaque Node dans GoJS possède un attribut data qui contient ses données associées (par exemple, son texte, son ID, etc.).
        this.selectionService.setSelectedNode(part.data); //this.selectionService.setSelectedNode(part.data); envoie ces données au service Angular (selectionService) pour les partager avec d'autres composants (ex: la sidebar).
      }
    });
    ////////////////

    ///fin///

    // definition mtaa les nodes mtaa palette
    this.myPalette.nodeTemplateMap.add(
      '', // the default category , '' :
      new go.Node('Auto')
        .apply(nodeStyle) //Crée un nœud avec un layout automatique ('Auto'), ce qui signifie que son contenu sera ajusté à sa forme.
        .add(
          new go.Shape('RoundedRectangle', {
            width: 180,
            height: 40,
            fromLinkable: true,
            toLinkable: true,
            fromSpot: go.Spot.AllSides,
            toSpot: go.Spot.AllSides,

            // fromLinkable: true → Peut envoyer des connexions (Link).
            // toLinkable: true → Peut recevoir des connexions.
            // fromSpot: go.Spot.AllSides → Peut envoyer des liens depuis n'importe quel côté.
            //toSpot: go.Spot.AllSides → Peut recevoir des liens de n'importe quel côté.
          })
            .apply((shape) => shapeStyle(shape, 0))
            .theme('fill', 'step'), //yestaaml el couleur eli mahtout fel step selon theme choisi ,wdeclaration mtaa les themes elfou9
          new go.TextBlock({
            margin: 12,
            maxSize: new go.Size(180, NaN), //Limite la largeur à 160 pixels, mais la hauteur est illimitée (NaN).
            wrap: go.Wrap.Fit, // Active le retour à la ligne si le texte dépasse la largeur maximale.
            editable: true, // Le texte peut être modifié par l'utilisateur.
          })
            .apply(textStyle)
            .bindTwoWay('text')
        )
    );
    // Définir un gabarit pour l’espaceur (élément invisible)
    this.myPalette.nodeTemplateMap.add(
      'Spacer',
      $(
        go.Node,
        { selectable: false, movable: false },
        $(go.TextBlock, '', { margin: new go.Margin(40, 0, 0, 0) }) // Décale vers le bas
      )
    );

    // le composant titre (checkpoint,task,..) du palette
    this.myPalette.nodeTemplateMap.add(
      'Title',
      $(
        go.Node,
        'Auto',
        { selectable: false, locationSpot: go.Spot.Center }, // Désactive la sélection du titre
        $(
          go.Shape,
          'RoundedRectangle',
          { fill: '#284B63', strokeWidth: 0, height: 30, width: 180 } // Fond bleu clair
        ),
        $(
          go.TextBlock,
          { margin: 5, font: 'bold 12px sans-serif', stroke: 'white' },
          new go.Binding('text', 'text')
        )
      )
    );
    this.myPalette.nodeTemplateMap.add(
      'Start',
      new go.Node('Auto').apply(nodeStyle).add(
        new go.Shape('Circle', { fromLinkable: true, stroke: 'gray' })
          .apply((shape) => shapeStyle(shape, 2))
          .theme('fill', 'start'),
        new go.TextBlock({
          margin: new go.Margin(5),
          stroke: 'white',
          font: 'bold 7px sans-serif',
        })
          // .apply(textStyle)
          .bind('text') //Liaison simple (bind('text')) → Peut afficher un texte dynamique, mais pas bidirectionnellement.
      )
    );

    this.myPalette.nodeTemplateMap.add(
      'End',
      new go.Node('Auto').apply(nodeStyle).add(
        new go.Shape('Circle', { toLinkable: true })
          .apply((shape) => shapeStyle(shape, 0))
          .theme('fill', 'end'),
        new go.TextBlock({
          margin: new go.Margin(6),
          stroke: 'gray',
          font: 'bold 8px sans-serif',
        })
          // .apply(textStyle)
          .bind('text')
      )
    );
    this.myPalette.nodeTemplateMap.add(
      'Conditional',
      new go.Node('Auto').apply(nodeStyle).add(
        new go.Shape('Conditional', { fromLinkable: true, toLinkable: true })
          .apply((shape) => shapeStyle(shape, 0))
          .theme('fill', 'conditional'),
        new go.TextBlock({
          margin: 8,
          maxSize: new go.Size(160, NaN),
          wrap: go.Wrap.Fit,
          textAlign: 'center',
          editable: true,
          stroke: 'white',
        })
          // .apply(textStyle)
          .bindTwoWay('text')
      )
    );
    this.myPalette.nodeTemplateMap.add(
      'Comment',
      new go.Node('Auto').apply(nodeStyle).add(
        new go.Shape('File', { strokeWidth: 3 })
          .theme('fill', 'div')
          .theme('stroke', 'comment'),
        new go.TextBlock({
          font: '9pt Figtree, sans-serif',
          margin: 8,
          maxSize: new go.Size(200, NaN),
          wrap: go.Wrap.Fit,
          textAlign: 'center',
          editable: true,
        })
          .theme('stroke', 'bgText')
          .bindTwoWay('text')
        // no ports, because no links are allowed to connect with a comment
      )
    );
    this.myPalette.nodeTemplateMap.add(
      'Sleep', // the default category , '' :
      new go.Node('Auto')
        .apply(nodeStyle) //Crée un nœud avec un layout automatique ('Auto'), ce qui signifie que son contenu sera ajusté à sa forme.
        .add(
          new go.Shape('RoundedRectangle', {
            width: 180,
            height: 40,
            fromLinkable: true,
            toLinkable: true,
            fromSpot: go.Spot.AllSides,
            toSpot: go.Spot.AllSides,
          })
            .apply((shape) => shapeStyle(shape, 0))
            .theme('fill', 'step'), //yestaaml el couleur eli mahtout fel step selon theme choisi ,wdeclaration mtaa les themes elfou9
          new go.TextBlock({
            margin: 12,
            maxSize: new go.Size(180, NaN), //Limite la largeur à 160 pixels, mais la hauteur est illimitée (NaN).
            wrap: go.Wrap.Fit, // Active le retour à la ligne si le texte dépasse la largeur maximale.
            editable: true, // Le texte peut être modifié par l'utilisateur.
          })
            .apply(textStyle)
            .bindTwoWay('text'),
          new go.Picture({
            source: 'assets/css/horloge.png', // Correction du chemin d'image
            desiredSize: new go.Size(20, 20),
            alignment: new go.Spot(0.05, 0.5), // Positionnement
          })
        )
    );
    this.myPalette.nodeTemplateMap.add(
      'Cmd Stage', // the default category , '' :
      new go.Node('Auto')
        .apply(nodeStyle) //Crée un nœud avec un layout automatique ('Auto'), ce qui signifie que son contenu sera ajusté à sa forme.
        .add(
          new go.Shape('RoundedRectangle', {
            width: 180,
            height: 40,
            fromLinkable: true,
            toLinkable: true,
            fromSpot: go.Spot.AllSides,
            toSpot: go.Spot.AllSides,
          })
            .apply((shape) => shapeStyle(shape, 0))
            .theme('fill', 'step'), //yestaaml el couleur eli mahtout fel step selon theme choisi ,wdeclaration mtaa les themes elfou9
          new go.TextBlock({
            margin: 12,
            maxSize: new go.Size(180, NaN), //Limite la largeur à 160 pixels, mais la hauteur est illimitée (NaN).
            wrap: go.Wrap.Fit, // Active le retour à la ligne si le texte dépasse la largeur maximale.
            editable: true, // Le texte peut être modifié par l'utilisateur.
          })
            .apply(textStyle)
            .bindTwoWay('text'),
          new go.Picture({
            source: 'assets/css/terminal.png', // Correction du chemin d'image
            desiredSize: new go.Size(20, 20),
            alignment: new go.Spot(0.05, 0.5), // Positionnement
          })
        )
    );

    ///tache compose////
    this.myPalette.nodeTemplateMap.add(
      'CompositeTask', // the default category , '' :
      new go.Node('Auto')
        .apply(nodeStyle) //Crée un nœud avec un layout automatique ('Auto'), ce qui signifie que son contenu sera ajusté à sa forme.
        .add(
          new go.Shape('RoundedRectangle', {
            width: 180,
            height: 40,
            fromLinkable: true,
            toLinkable: true,
            fromSpot: go.Spot.AllSides,
            toSpot: go.Spot.AllSides,

            // fromLinkable: true → Peut envoyer des connexions (Link).
            // toLinkable: true → Peut recevoir des connexions.
            // fromSpot: go.Spot.AllSides → Peut envoyer des liens depuis n'importe quel côté.
            //toSpot: go.Spot.AllSides → Peut recevoir des liens de n'importe quel côté.
          })
            .apply((shape) => shapeStyle(shape, 0))
            .theme('fill', 'compositeTask'), //yestaaml el couleur eli mahtout fel step selon theme choisi ,wdeclaration mtaa les themes elfou9
          new go.TextBlock({
            margin: 12,
            maxSize: new go.Size(180, NaN), //Limite la largeur à 160 pixels, mais la hauteur est illimitée (NaN).
            wrap: go.Wrap.Fit, // Active le retour à la ligne si le texte dépasse la largeur maximale.
            editable: true, // Le texte peut être modifié par l'utilisateur.
          })
            .apply(textStyle)
            .bindTwoWay('text'),
          new go.Picture() // Ajout de l'icône dynamiquement
            .bind('source', 'icon', (icon) => `assets/css/${icon}`)
            .set({ desiredSize: new go.Size(20, 20) })
            .set({ alignment: new go.Spot(0.05, 0.5) }) // Déplace l'icône vers le haut
        )
    );

    ///fin///

    // replace the default Link template in the linkTemplateMap
    this.myDiagram.linkTemplate = new go.Link({
      routing: go.Routing.AvoidsNodes, // les liens ne se passe pas sur les nodes
      curve: go.Curve.JumpOver, // faire une pont si un lient passe sur un autre lien
      corner: 5, //une arrondi dans le lien si il tourne
      toShortLength: 4, //le lien ce termine avec la depart du fleche , (raison esthétique)
      relinkableFrom: true,
      relinkableTo: true,
      reshapable: true,
      resegmentable: true,

      // la configuration du lorsque je houvre sur un lien
      mouseEnter: (e: go.InputEvent, thisObj: go.GraphObject) => {
        const link = thisObj instanceof go.Link ? thisObj : null;
        if (link) {
          const highlight = link.findObject('HIGHLIGHT');
          if (highlight instanceof go.Shape) {
            highlight.stroke =
              (link.diagram?.themeManager?.findValue(
                'linkOver',
                'colors'
              ) as string) || 'black';
          }
        }
      },

      mouseLeave: (e: go.InputEvent, thisObj: go.GraphObject) => {
        const link = thisObj instanceof go.Link ? thisObj : null;
        if (link) {
          const highlight = link.findObject('HIGHLIGHT');
          if (highlight instanceof go.Shape) {
            highlight.stroke = 'transparent';
          }
        }
      },

      contextClick: (e: go.InputEvent, thisObj: go.GraphObject) => {
        const link = thisObj instanceof go.Link ? thisObj : null;
        if (link && e.diagram && link.data) {
          e.diagram.model.commit((m: go.Model) => {
            m.set(link.data, 'text', 'Label');
          });
        }
      },
    })
      .bindTwoWay('points')
      .add(
        // the highlight shape, normally transparent
        new go.Shape({
          isPanelMain: true,
          strokeWidth: 8,
          stroke: 'transparent',
          name: 'HIGHLIGHT',
        }),
        // the link path shape
        new go.Shape({ isPanelMain: true, strokeWidth: 2 }).theme(
          'stroke',
          'link'
        ),
        // the arrowhead
        new go.Shape({ toArrow: 'standard', strokeWidth: 0, scale: 1.5 }).theme(
          'fill',
          'link'
        ),
        // the link label
        new go.Panel('Auto', { visible: false }) //par defaut maydhhorch el label eli wra el link ,
          .bind('visible', 'text', (t) => typeof t === 'string' && t.length > 0) //ken fama text ywali ydhhor el label , fou9 el link
          .add(
            // nzidou forme cercle degradé wra el label , bech twali lisible akther
            new go.Shape('Ellipse', { strokeWidth: 0 }).theme(
              'fill',
              'div',
              undefined,
              undefined,
              (c) => new go.Brush('Radial', { 0: c, 0.5: `${c}00` })
            ),

            new go.TextBlock({
              name: 'LABEL',
              font: '9pt Figtree, sans-serif',
              margin: 3,
              editable: true,
            })
              .theme('stroke', 'bgText')
              .bindTwoWay('text')
          )
      );

    // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
    this.myDiagram.toolManager.linkingTool.temporaryLink.routing =
      go.Routing.Orthogonal;
    this.myDiagram.toolManager.relinkingTool.temporaryLink.routing =
      go.Routing.Orthogonal;

    this.load();

    // activer cette ligne pour vider le locale storage//
    // localStorage.clear();

    //////cette function affiche le stockage du locale storage dans la console/////
    function getLocalStorageSize(): number {
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage.getItem(key)?.length || 0;
        }
      }
      return total / 1024; // Taille en Ko
    }

    console.log(
      'Espace utilisé dans LocalStorage:',
      getLocalStorageSize(),
      'Ko'
    );
    //////fin/////

    // le contenu affiché dans la palette
    const savedTasks = JSON.parse(
      localStorage.getItem('compositeTasks') || '[]'
    );

    this.myPalette = new go.Palette('myPaletteDiv', {
      nodeTemplateMap: this.myPalette.nodeTemplateMap,
      themeManager: this.myPalette.themeManager,
      model: new go.GraphLinksModel([
        { category: 'Spacer', text: '' },
        { category: 'Spacer', text: '' },
        { category: 'Title', text: 'CheckPoint' }, // Ajout du titre
        { category: 'Start', text: 'Start' },
        { category: 'End', text: 'End' },
        { category: 'Conditional', text: 'Condition' },
        { category: 'Comment', text: 'Comment' },

        { category: 'Title', text: 'Task' }, // Ajout du titre
        // { text: 'Intent' },
        {
          category: 'Sleep',
          text: 'Sleep',
          description:
            'This task sets a delay before executing the next action (millisecond)',
          Time_sleep: 500,
        },
        {
          category: 'Cmd Stage',
          text: 'Cmd Stage',
          description:
            'This task executes a specified CMD command to automate a process',
          cmd: '',
          root: false,
        },

        { category: 'Title', text: ' Composite Task' }, // Ajout du titre

        // { text: 'Sleep' },
        // { text: 'Cmd Stage' },
        ...savedTasks, // Ajouter les tâches sauvegardées
      ]),
    });

    this.saveSubscription = this.selectionService.saveAction$.subscribe(() => {
      this.save();
    });
    /////
    this.startSubscription = this.selectionService.startDiagram$.subscribe(
      () => {
        this.start();
      }
    );

    /////les données envoyé par le modal//

    this.selectionService.currentTask.subscribe((task) => {
      if (task) {
        this.task = task;
        console.log('Tâche reçue :', this.task);
        this.addTaskToPalette(this.task);
      }
    });
    //////fin///////

    /////suppresion de composite task dés la palette//
    this.selectionService.deleteTask$.subscribe((taskTitle) => {
      this.removeTaskFromPalette(taskTitle);
    });
    //////fin///////
  }

  //////ajouter un composant dans la palette par les données recu du modal//////
  addTaskToPalette(task: any) {
    if (!this.myPalette) return;

    // Récupérer le modèle actuel et ajouter la nouvelle tâche
    const model = this.myPalette.model as go.GraphLinksModel;

    // Créer un nouvel objet tâche avec les attributs de `task`
    const newTaskNode = {
      category: 'CompositeTask',
      text: task.title, // Utilise la valeur de la tâche reçue
      description: task.description || '',
      // icon:task.icon,
      icon: task.icon,
      pipeline: JSON.parse(task.pipeline),
    };

    // Ajouter l'élément au modèle
    model.addNodeData(newTaskNode);

    console.log('Nouvelle tâche ajoutée à la palette :', newTaskNode);
    // Récupérer les tâches enregistrées
    const savedTasks = JSON.parse(
      localStorage.getItem('compositeTasks') || '[]'
    );

    // Ajouter la nouvelle tâche
    savedTasks.push(newTaskNode);

    // Sauvegarder la liste mise à jour
    localStorage.setItem('compositeTasks', JSON.stringify(savedTasks));
  }
  //////fin///////

    //////supprimer composite task dans la palette //////

  // removeTaskFromPalette(taskTitle: string) {
  //   if (!this.myPalette) return;
  
  //   // Récupérer le modèle actuel
  //   const model = this.myPalette.model as go.GraphLinksModel;
  
  //   // Trouver l’élément à supprimer
  //   const nodeToRemove = model.nodeDataArray.find((node: any) => node.text === taskTitle);
  
  //   if (nodeToRemove) {
  //     // Supprimer du modèle GoJS
  //     model.removeNodeData(nodeToRemove);
  
  //     console.log('Tâche supprimée de la palette :', nodeToRemove);
  
  //     // Récupérer les tâches enregistrées dans le localStorage
  //     let savedTasks = JSON.parse(localStorage.getItem('compositeTasks') || '[]');
  
  //     // Filtrer pour supprimer la tâche correspondante
  //     savedTasks = savedTasks.filter((task: any) => task.text !== taskTitle);
  
  //     // Sauvegarder la liste mise à jour
  //     localStorage.setItem('compositeTasks', JSON.stringify(savedTasks));
  //   }
  // }

  removeTaskFromPalette(taskTitle: string) {
    if (!this.myPalette) return;
  
    const model = this.myPalette.model as go.GraphLinksModel;
    const nodeToRemove = model.nodeDataArray.find((node: any) => node.text === taskTitle);
  
    if (nodeToRemove) {
      model.removeNodeData(nodeToRemove);
      console.log('Tâche supprimée de la palette :', nodeToRemove);
  
      let savedTasks = JSON.parse(localStorage.getItem('compositeTasks') || '[]');
      savedTasks = savedTasks.filter((task: any) => task.text !== taskTitle);
      localStorage.setItem('compositeTasks', JSON.stringify(savedTasks));
    }
  }
    //////fin///////
  

  ngOnDestroy() {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }
    if (this.startSubscription) {
      this.startSubscription.unsubscribe();
    }
  }

  // les nodes personalisé
  defineFigures(): void {
    go.Shape.defineFigureGenerator('Conditional', (shape, w, h) => {
      const geo = new go.Geometry();
      const fig = new go.PathFigure(w * 0.15, 0, true);
      geo.add(fig);
      fig.add(new go.PathSegment(go.SegmentType.Line, w * 0.85, 0));
      fig.add(new go.PathSegment(go.SegmentType.Line, w, 0.5 * h));
      fig.add(new go.PathSegment(go.SegmentType.Line, w * 0.85, h));
      fig.add(new go.PathSegment(go.SegmentType.Line, w * 0.15, h));
      fig.add(new go.PathSegment(go.SegmentType.Line, 0, 0.5 * h).close());
      geo.spot1 = new go.Spot(0.15, 0);
      geo.spot2 = new go.Spot(0.85, 1);
      return geo;
    });

    go.Shape.defineFigureGenerator('RoundedRectangle', (shape, w, h) => {
      const radius = Math.min(w, h) * 0.1; // Rayon des coins arrondis (20% de la plus petite dimension)
      const geo = new go.Geometry();
      const fig = new go.PathFigure(radius, 0, true); // Début du chemin

      geo.add(fig);

      // Ligne supérieure droite avec coin arrondi
      fig.add(new go.PathSegment(go.SegmentType.Line, w - radius, 0));
      fig.add(
        new go.PathSegment(
          go.SegmentType.Arc,
          270,
          90,
          w - radius,
          radius,
          radius,
          radius
        )
      );

      // Ligne droite droite avec coin arrondi
      fig.add(new go.PathSegment(go.SegmentType.Line, w, h - radius));
      fig.add(
        new go.PathSegment(
          go.SegmentType.Arc,
          0,
          90,
          w - radius,
          h - radius,
          radius,
          radius
        )
      );

      // Ligne inférieure avec coin arrondi
      fig.add(new go.PathSegment(go.SegmentType.Line, radius, h));
      fig.add(
        new go.PathSegment(
          go.SegmentType.Arc,
          90,
          90,
          radius,
          h - radius,
          radius,
          radius
        )
      );

      // Ligne gauche avec coin arrondi
      fig.add(new go.PathSegment(go.SegmentType.Line, 0, radius));
      fig.add(
        new go.PathSegment(
          go.SegmentType.Arc,
          180,
          90,
          radius,
          radius,
          radius,
          radius
        )
      );

      geo.spot1 = new go.Spot(0, 0); // Positionnement du texte et des connexions
      geo.spot2 = new go.Spot(1, 1);

      return geo;
    });

    go.Shape.defineFigureGenerator('File', (shape, w, h) => {
      const geo = new go.Geometry();
      const fig = new go.PathFigure(0, 0, true);
      geo.add(fig);
      fig.add(new go.PathSegment(go.SegmentType.Line, 0.75 * w, 0));
      fig.add(new go.PathSegment(go.SegmentType.Line, w, 0.25 * h));
      fig.add(new go.PathSegment(go.SegmentType.Line, w, h));
      fig.add(new go.PathSegment(go.SegmentType.Line, 0, h).close());
      const fig2 = new go.PathFigure(0.75 * w, 0, false);
      geo.add(fig2);
      fig2.add(new go.PathSegment(go.SegmentType.Line, 0.75 * w, 0.25 * h));
      fig2.add(new go.PathSegment(go.SegmentType.Line, w, 0.25 * h));
      geo.spot1 = new go.Spot(0, 0.25);
      geo.spot2 = go.Spot.BottomRight;
      return geo;
    });
  }

  // Autres méthodes comme save(), load(), printDiagram(), etc. seront aussi définies ici.

  // cette methode charge le modele et le convertir en format json et affecter dans une constante savedModel et afficher leur contenu (html) dans l'ecran
  save(): void {
    if (!this.myDiagram) return;

    const savedModel = document.getElementById(
      'mySavedModel'
    ) as HTMLTextAreaElement;
    if (savedModel) {
      savedModel.value = this.myDiagram.model.toJson();
      this.myDiagram.isModified = false;
      const jsonData = savedModel.value; // Récupération du JSON sous forme de string
      const parsedData = JSON.parse(jsonData);
      console.log(parsedData);

      this.selectionService.setPipeline(jsonData);
    }
  }

  // start(): void {
  //   if (!this.myDiagram) return;
  
  //   const savedModel = document.getElementById(
  //     'mySavedModel'
  //   ) as HTMLTextAreaElement;
  //   if (!savedModel) return;
  
  //   const jsonData = savedModel.value;
  //   const parsedData = JSON.parse(jsonData);
  
  //   const nodeArray = parsedData.nodeDataArray;
  //   const linkArray = parsedData.linkDataArray;
  
  //   let cmdStages: CmdStage[] = [];
  //   let sleepTasks: Sleep_Task[] = [];
  //   let startTasks: Start_Task[] = [];
  //   let endTasks: End_Task[] = [];
  //   let compositeTasks: Composite_Task[] = [];
  //   let links: { from: string; to: string }[] = [];
  
  //   function parseCompositeTask(node: any): Composite_Task {
  //     let subCmdStages: CmdStage[] = [];
  //     let subSleepTasks: Sleep_Task[] = [];
  //     let subStartTasks: Start_Task[] = [];
  //     let subEndTasks: End_Task[] = [];
  //     let subCompositeTasks: Composite_Task[] = [];
  //     let subLinks: { from: string; to: string }[] = [];
  
  //     if (node.pipeline) {
  //       node.pipeline.nodeDataArray.forEach((subNode: any) => {
  //         switch (subNode.category) {
  //           case 'Cmd Stage':
  //             subCmdStages.push(new CmdStage(subNode.key.toString(), subNode.text, subNode.cmd || "", subNode.root ? 1 : 0));
  //             break;
  //           case 'Sleep':
  //             subSleepTasks.push(new Sleep_Task(subNode.key.toString(), subNode.text, subNode.Time_sleep));
  //             break;
  //           case 'Start':
  //             subStartTasks.push(new Start_Task(subNode.key.toString(), subNode.text));
  //             break;
  //           case 'End':
  //             subEndTasks.push(new End_Task(subNode.key.toString(), subNode.text));
  //             break;
  //           case 'CompositeTask':
  //             subCompositeTasks.push(parseCompositeTask(subNode));
  //             break;
  //         }
  //       });
  
  //       subLinks = node.pipeline.linkDataArray.map((subLink: any) => ({
  //         from: subLink.from.toString(),
  //         to: subLink.to.toString(),
  //       }));
  //     }
  
  //     return new Composite_Task(
  //       node.key.toString(),
  //       node.text,
  //       subCmdStages.length ? subCmdStages : [],
  //       subSleepTasks.length ? subSleepTasks : [],
  //       subStartTasks.length ? subStartTasks : [],
  //       subEndTasks.length ? subEndTasks : [],
  //       subCompositeTasks.length ? subCompositeTasks : [],
  //       subLinks.length ? subLinks : []
  //     );
  //   }
  
  //   nodeArray.forEach((node: any) => {
  //     switch (node.category) {
  //       case 'Cmd Stage':
  //         cmdStages.push(new CmdStage(node.key.toString(), node.text, node.cmd || "", node.root ? 1 : 0));
  //         break;
  //       case 'Sleep':
  //         sleepTasks.push(new Sleep_Task(node.key.toString(), node.text, node.Time_sleep));
  //         break;
  //       case 'Start':
  //         startTasks.push(new Start_Task(node.key.toString(), node.text));
  //         break;
  //       case 'End':
  //         endTasks.push(new End_Task(node.key.toString(), node.text));
  //         break;
  //       case 'CompositeTask':
  //         compositeTasks.push(parseCompositeTask(node));
  //         break;
  //     }
  //   });
  
  //   links = linkArray.map((link: any) => ({
  //     from: link.from.toString(),
  //     to: link.to.toString(),
  //   }));
  
  //   let formattedJson: any = {};
  //   if (cmdStages.length) formattedJson['Cmd Stage'] = cmdStages;
  //   if (sleepTasks.length) formattedJson['Sleep'] = sleepTasks;
  //   if (startTasks.length) formattedJson['Start'] = startTasks;
  //   if (endTasks.length) formattedJson['End'] = endTasks;
  //   if (compositeTasks.length) formattedJson['CompositeTask'] = compositeTasks;
  //   if (links.length) formattedJson['Links'] = links;
  
  //   const outputTextArea = document.getElementById(
  //     'outputJson'
  //   ) as HTMLTextAreaElement;
  //   if (outputTextArea) {
  //     outputTextArea.value = JSON.stringify(formattedJson, null, 2);
  //   }
  // }
  start(): void {
    if (!this.myDiagram) return;
  
    const savedModel = document.getElementById(
      'mySavedModel'
    ) as HTMLTextAreaElement;
    if (!savedModel) return;
  
    const jsonData = savedModel.value;
    const parsedData = JSON.parse(jsonData);
  
    const nodeArray = parsedData.nodeDataArray;
    const linkArray = parsedData.linkDataArray;
  
    let cmdStages: CmdStage[] = [];
    let sleepTasks: Sleep_Task[] = [];
    let startTasks: Start_Task[] = [];
    let endTasks: End_Task[] = [];
    let compositeTasks: Composite_Task[] = [];
    let links: { from: string; to: string }[] = [];
  
    function parseCompositeTask(node: any): Composite_Task {
      let subCmdStages: CmdStage[] = [];
      let subSleepTasks: Sleep_Task[] = [];
      let subStartTasks: Start_Task[] = [];
      let subEndTasks: End_Task[] = [];
      let subCompositeTasks: Composite_Task[] = [];
      let subLinks: { from: string; to: string }[] = [];
  
      if (node.pipeline) {
        node.pipeline.nodeDataArray.forEach((subNode: any) => {
          switch (subNode.category) {
            case 'Cmd Stage':
              subCmdStages.push(new CmdStage(subNode.key.toString(), subNode.text, subNode.cmd || "", subNode.root ? 1 : 0));
              break;
            case 'Sleep':
              subSleepTasks.push(new Sleep_Task(subNode.key.toString(), subNode.text, subNode.Time_sleep));
              break;
            case 'Start':
              subStartTasks.push(new Start_Task(subNode.key.toString(), subNode.text));
              break;
            case 'End':
              subEndTasks.push(new End_Task(subNode.key.toString(), subNode.text));
              break;
            case 'CompositeTask':
              subCompositeTasks.push(parseCompositeTask(subNode));
              break;
          }
        });
  
        subLinks = node.pipeline.linkDataArray.map((subLink: any) => ({
          from: subLink.from.toString(),
          to: subLink.to.toString(),
        }));
      }
  
      // Créer un objet composite task qui ne contient que les tableaux non vides
      const compositeTask: any = {
        id: node.key.toString(),
        title: node.text
      };
  
      if (subCmdStages.length) compositeTask.cmdStages = subCmdStages;
      if (subSleepTasks.length) compositeTask.sleepTasks = subSleepTasks;
      if (subStartTasks.length) compositeTask.startTasks = subStartTasks;
      if (subEndTasks.length) compositeTask.endTasks = subEndTasks;
      if (subCompositeTasks.length) compositeTask.compositeTasks = subCompositeTasks;
      if (subLinks.length) compositeTask.links = subLinks;
  
      return compositeTask as Composite_Task;
    }
  
    nodeArray.forEach((node: any) => {
      switch (node.category) {
        case 'Cmd Stage':
          cmdStages.push(new CmdStage(node.key.toString(), node.text, node.cmd || "", node.root ? 1 : 0));
          break;
        case 'Sleep':
          sleepTasks.push(new Sleep_Task(node.key.toString(), node.text, node.Time_sleep));
          break;
        case 'Start':
          startTasks.push(new Start_Task(node.key.toString(), node.text));
          break;
        case 'End':
          endTasks.push(new End_Task(node.key.toString(), node.text));
          break;
        case 'CompositeTask':
          compositeTasks.push(parseCompositeTask(node));
          break;
      }
    });
  
    links = linkArray.map((link: any) => ({
      from: link.from.toString(),
      to: link.to.toString(),
    }));
  
    // Création du JSON formaté qui ne contient que les tableaux non vides
    let formattedJson: any = {};
    if (cmdStages.length) formattedJson['Cmd Stage'] = cmdStages;
    if (sleepTasks.length) formattedJson['Sleep'] = sleepTasks;
    if (startTasks.length) formattedJson['Start'] = startTasks;
    if (endTasks.length) formattedJson['End'] = endTasks;
    if (compositeTasks.length) formattedJson['CompositeTask'] = compositeTasks;
    if (links.length) formattedJson['Links'] = links;
  
    const outputTextArea = document.getElementById(
      'outputJson'
    ) as HTMLTextAreaElement;
    if (outputTextArea) {
      outputTextArea.value = JSON.stringify(formattedJson, null, 2);
    }
  }
  
  

  load(): void {
    if (!this.myDiagram) return;

    const savedModel = document.getElementById(
      'mySavedModel'
    ) as HTMLTextAreaElement;
    if (savedModel) {
      this.myDiagram.model = go.Model.fromJson(savedModel.value);
    }

    // console.log(this.myDiagram.model)
  }

  // print the diagram by opening a new window holding SVG images of the diagram contents for each page
  printDiagram(): void {
    if (!this.myDiagram) return;

    const svgWindow = window.open();
    if (!svgWindow) return;

    svgWindow.document.title = 'GoJS Flowchart';
    svgWindow.document.body.style.margin = '0px';

    const printSize = new go.Size(700, 960);
    const bnds = this.myDiagram.documentBounds;
    let x = bnds.x;
    let y = bnds.y;

    while (y < bnds.bottom) {
      while (x < bnds.right) {
        const svg = this.myDiagram.makeSvg({
          scale: 1.0,
          position: new go.Point(x, y),
          size: printSize,
          background: 'white',
        });
        if (svg) {
          svgWindow.document.body.appendChild(svg);
        }

        x += printSize.width;
      }
      x = bnds.x;
      y += printSize.height;
    }

    setTimeout(() => {
      svgWindow.print();
      svgWindow.close();
    }, 1);
  }

  changeTheme(): void {
    const myDiagram = go.Diagram.fromDiv('myDiagramDiv');
    if (myDiagram) {
      const themeElement = document.getElementById(
        'theme'
      ) as HTMLSelectElement;
      if (themeElement) {
        myDiagram.themeManager.currentTheme = themeElement.value;
      }
    }
  }
}
