import { HtmlParser } from '@angular/compiler';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as go from 'gojs';

@Component({
  selector: 'app-gojs-diagram',
  templateUrl: './gojs-diagram.component.html',
  styleUrls: ['./gojs-diagram.component.css'],
})
export class GojsDiagramComponent implements AfterViewInit {
  private myDiagram: go.Diagram | null = null;
  private myPalette: go.Palette | null = null;
  constructor() {}

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
        texte:"white",
        text: 'black',
        start: '#064e3b',
        step: '#E9E9E9',
        conditional: '#6a9a8a',
        end: '#7f1d1d',
        comment: '#a691cc',
        bgText: '#000',
        link: '#dcb263',
        linkOver: '#cbd5e1',
        div: '#FFFFFF',
        // div: '#ede9e0'
      },
    });

    // tableau du themeManager pour myPalette
    this.myPalette.themeManager.set('light', {
      colors: {
        text: 'black',
        start: '#064e3b',
        step: '#E9E9E9',
        conditional: '#6a9a8a',
        end: '#7f1d1d',
        comment: '#a691cc',
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
    function shapeStyle(shape: go.Shape) {
      shape.set({
        strokeWidth: 0, // Supprime le contour
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
      return shape.set({
        // fill: theme.colors.nodeBackground,
        strokeWidth: STROKE_WIDTH,
      })
      .theme('fill', 'step');
    }


        // l'icon de ma node wifi
    const NodeImage = (): go.Panel =>
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
          source: 'assets/css/wifi.png',
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
            .apply(shapeStyle)
            .theme('fill', 'step'), //utilise le couleur du attribut "step" selon theme choisi ,(déclaration des themes au dessus)
          new go.TextBlock({ //configuration du texte ecrivé  dans la node de category ''
            margin: 12,
            maxSize: new go.Size(150, NaN), //Limite la largeur à 160 pixels, mais la hauteur est illimitée (NaN).
            wrap: go.Wrap.Fit, // Active le retour à la ligne si le texte dépasse la largeur maximale.
            editable: true, // Le texte peut être modifié par l'utilisateur.
            alignment: new go.Spot(0.5, 0.8),
          })
            .apply(textStyle)
            .bindTwoWay('text'),
            NodeImage(), // l'icon de la node
        )
        
    );

    // ce composant et un composant personalisée construis par la fonction defineFigure et appelé ici pour etre affiché dans le diagramme
    this.myDiagram.nodeTemplateMap.add(
      'Conditional',
      new go.Node('Auto').apply(nodeStyle).add(
        new go.Shape('Conditional', { fromLinkable: true, toLinkable: true })
          .apply(shapeStyle)
          .theme('fill', 'conditional'),
        new go.TextBlock({
          margin: 8,
          maxSize: new go.Size(160, NaN),
          wrap: go.Wrap.Fit,
          textAlign: 'center',
          editable: true,
          stroke: "white" 
        })
          // .apply(textStyle)
          .bindTwoWay('text')
      )
    );

    this.myDiagram.nodeTemplateMap.add(
      'Start',
      new go.Node('Auto').apply(nodeStyle).add(
        new go.Shape('Capsule', { fromLinkable: true })
          .apply(shapeStyle)
          .theme('fill', 'start'),
        new go.TextBlock('Start', { margin: new go.Margin(5, 6),stroke: "white" })
          // .apply(textStyle)
          .bind('text') //Liaison simple (bind('text')) → Peut afficher un texte dynamique, mais pas bidirectionnellement.
      )
    );

    this.myDiagram.nodeTemplateMap.add(
      'End',
      new go.Node('Auto')
        .apply(nodeStyle)
        .add(
          new go.Shape('Capsule', { toLinkable: true })
            .apply(shapeStyle)
            .theme('fill', 'end'),
          new go.TextBlock('End', { margin: new go.Margin(5, 6) ,stroke: "white"} )
            // .apply(textStyle)
            .bind('text')
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
            .apply(shapeStyle)
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

    this.myPalette.nodeTemplateMap.add(
      'Conditional',
      new go.Node('Auto').apply(nodeStyle).add(
        new go.Shape('Conditional', { fromLinkable: true, toLinkable: true })
          .apply(shapeStyle)
          .theme('fill', 'conditional'),
        new go.TextBlock({
          margin: 8,
          maxSize: new go.Size(160, NaN),
          wrap: go.Wrap.Fit,
          textAlign: 'center',
          editable: true,
          stroke: "white" 
        })
          // .apply(textStyle)
          .bindTwoWay('text')
      )
    );

    this.myPalette.nodeTemplateMap.add(
      'Start',
      new go.Node('Auto').apply(nodeStyle).add(
        new go.Shape('Capsule', { fromLinkable: true })
          .apply(shapeStyle)
          .theme('fill', 'start'),
        new go.TextBlock('Start', { margin: new go.Margin(5, 6),stroke: "white" })
          // .apply(textStyle)
          .bind('text') //Liaison simple (bind('text')) → Peut afficher un texte dynamique, mais pas bidirectionnellement.
      )
    );

    this.myPalette.nodeTemplateMap.add(
      'End',
      new go.Node('Auto')
        .apply(nodeStyle)
        .add(
          new go.Shape('Capsule', { toLinkable: true })
            .apply(shapeStyle)
            .theme('fill', 'end'),
          new go.TextBlock('End', { margin: new go.Margin(5, 6),stroke: "white" })
            // .apply(textStyle)
            .bind('text')
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
          { fill: '#E4ECF7', strokeWidth: 0, height: 30, width: 180 } // Fond bleu clair
        ),
        $(
          go.TextBlock,
          { margin: 5, font: 'bold 12px sans-serif', stroke: 'gray' },
          new go.Binding('text', 'text')
        )
      )
    );



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


    // le contenu affiché dans la palette
    this.myPalette = new go.Palette('myPaletteDiv', {
      nodeTemplateMap: this.myPalette.nodeTemplateMap,
      themeManager: this.myPalette.themeManager,
      model: new go.GraphLinksModel([
        { text: '', category: 'Spacer' },
        { text: '', category: 'Spacer' },
        { text: 'CheckPoint', category: 'Title' }, // Ajout du titre
        { category: 'Start', text: 'Start' },
        { category: 'End', text: 'End' },
        { category: 'Conditional', text: 'Condition' },
        { category: 'Comment', text: 'Comment' },

        { text: 'Task', category: 'Title' }, // Ajout du titre
        { text: 'Intent' },
        { text: 'Sleep' },
        { text: 'Cmd Stage' },

        { text: ' Composite Task', category: 'Title' }, // Ajout du titre
        { text: 'Intent' },
        { text: 'Sleep' },
        { text: 'Cmd Stage' },
      ]),
    });
    
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

  save(): void {
    if (!this.myDiagram) return;

    const savedModel = document.getElementById(
      'mySavedModel'
    ) as HTMLTextAreaElement;
    if (savedModel) {
      savedModel.value = this.myDiagram.model.toJson();
      this.myDiagram.isModified = false;
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

    console.log(this.myDiagram.model)
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


