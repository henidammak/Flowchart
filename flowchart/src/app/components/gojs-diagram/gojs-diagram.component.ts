import { Component, OnInit,AfterViewInit } from '@angular/core';
import * as go from 'gojs';

@Component({
  selector: 'app-gojs-diagram',
  templateUrl: './gojs-diagram.component.html',
  styleUrls: ['./gojs-diagram.component.css']
})
export class GojsDiagramComponent implements AfterViewInit {
  
  private myDiagram: go.Diagram | null = null;
  private myPalette: go.Palette | null = null;
  constructor() { }

  // ngAfterViewInit(): void {
  //   setTimeout(() => {
  //     this.initDiagram();
  //   }, 300);
  // }
  ngAfterViewInit(): void {
    const diagramDiv = document.getElementById('myDiagramDiv');
    if (diagramDiv) { 
      this.initDiagram();
    } else {
      console.error("Erreur: 'myDiagramDiv' n'existe pas.");
    }
  }
  

  initDiagram(): void {
    
    const $ = go.GraphObject.make;
    this.myDiagram = $(go.Diagram, 'myDiagramDiv', {
      'undoManager.isEnabled': true,
      'themeManager.changesDivBackground': true, //yekhou couleur el background ml div mtaa thememanager
      // 'themeManager.currentTheme': 'light' // initial theme

      // 'grid.visible': true,  // Affiche la grille
      // 'grid.gridCellSize': new go.Size(10, 10),  // Taille des cellules de la grille
      // 'grid.gridLineColor': 'gray',  // Couleur des lignes de la grille
      // 'grid.gridLineDash': [4, 4] 

    });
    // console.log(document.getElementById('myDiagramDiv'));
    // if (!this.myDiagram) {
    //   console.error("Erreur: Impossible d'initialiser le diagramme.");
    //   return;
    // }

    // console.log(document.getElementById('myDiagramDiv'));

// la grille arriere plan du diagram
    this.myDiagram.grid = $(
      go.Panel, "Grid",
      { gridCellSize: new go.Size(40, 40) },  // Taille des cellules
      $(go.Shape, "LineH", { stroke: "lightgray", strokeWidth: 0.5 }), // Lignes horizontales fines
      $(go.Shape, "LineV", { stroke: "lightgray", strokeWidth: 0.5 }), // Lignes verticales fines
    
      // Lignes plus épaisses toutes les 5 cellules
      $(go.Shape, "LineH", { stroke: "#E0E0E0", strokeWidth: 0.3  }, new go.Binding("interval", "", () => 5)),
      $(go.Shape, "LineV", { stroke: "#E0E0E0", strokeWidth: 0.3  }, new go.Binding("interval", "", () => 5))
    );
    ////////////////
    this.myPalette = go.GraphObject.make(go.Palette,  {
      'undoManager.isEnabled': true,
      'themeManager.changesDivBackground': true,

      contentAlignment: go.Spot.Top, // Aligner le contenu en haut
    });
    
    ///////////////

    this.myDiagram.addDiagramListener('Modified', (e) => {
      const button = document.getElementById('SaveButton')as HTMLButtonElement;
      console.log(button);
      if (button) button.disabled = !this.myDiagram?.isModified;
      const idx = document.title.indexOf('*');
      console.log(idx);
      const idt = document.title
      console.log(idt);

      if (this.myDiagram?.isModified) {
        if (idx < 0) document.title += '*';
        console.log(document.title);
      } else {
        if (idx >= 0) document.title = document.title.slice(0, idx);
      }
    });

    // set up some colors/fonts for the default ('light') and dark Themes

    this.myDiagram.themeManager.set('light', {
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
        div: '#FFFFFF',
        // div: '#ede9e0'
      }
    });

    this.myPalette.themeManager.set('light', {
      colors: {
        text: 'black',
        start: '#064e3b',
        // step: '#49939e',
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

    this.defineFigures();
////////////////////////////////
    // Continuez avec le reste de la logique GoJS ici, comme défini dans votre code JavaScript
    // Par exemple, ajouter les écouteurs d'événements, les modèles de noeud, etc.
    // helper definitions for node templates
    function nodeStyle(node: go.Part) {
      node
        .set({ locationSpot: go.Spot.Center })
        .bindTwoWay('location', 'loc', go.Point.parse, go.Point.stringify);
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
      textblock.set({ font: ' 11pt Figtree, sans-serif' }).theme('stroke', 'text');
    }
    
// definition mtaa les nodes mtaa diagram
    // define the Node templates for regular nodes signifie que ce modèle est utilisé si un nœud n'a pas de type (category) défini.
    this.myDiagram.nodeTemplateMap.add(
      '', // the default category , '' : 
      new go.Node('Auto').apply(nodeStyle) //Crée un nœud avec un layout automatique ('Auto'), ce qui signifie que son contenu sera ajusté à sa forme.
        .add(
          new go.Shape('RoundedRectangle', {
            // l whidth wel height hedhom kif ena7ihom yarjaa el shape standard w yadapti el taille mteou 7as el tex eli fi westou
            width: 150,
            height: 80, 
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
            maxSize: new go.Size(150, NaN), //Limite la largeur à 160 pixels, mais la hauteur est illimitée (NaN).
            wrap: go.Wrap.Fit,// Active le retour à la ligne si le texte dépasse la largeur maximale.
            editable: true // Le texte peut être modifié par l'utilisateur.
          })
            .apply(textStyle)
            .bindTwoWay('text')
        )
    );
 
    //el composant hedha personalisié , snaaneh fel defineFigures w ajoutineh lel gojs , bech staamlneh houni waayatnelou bel .shape
    this.myDiagram.nodeTemplateMap.add(
      'Conditional',
      new go.Node('Auto').apply(nodeStyle)
        .add(
          new go.Shape('Conditional', { fromLinkable: true, toLinkable: true }).apply(shapeStyle).theme('fill', 'conditional'),
          new go.TextBlock({
            margin: 8,
            maxSize: new go.Size(160, NaN),
            wrap: go.Wrap.Fit,
            textAlign: 'center',
            editable: true
          })
            .apply(textStyle)
            .bindTwoWay('text')
        )
    );

    this.myDiagram.nodeTemplateMap.add(
      'Start',
      new go.Node('Auto')
        .apply(nodeStyle)
        .add(
          new go.Shape('Capsule', { fromLinkable: true }).apply(shapeStyle).theme('fill', 'start'),
          new go.TextBlock('Start', { margin: new go.Margin(5, 6) }).apply(textStyle).bind('text') //Liaison simple (bind('text')) → Peut afficher un texte dynamique, mais pas bidirectionnellement.
        )
    );

    this.myDiagram.nodeTemplateMap.add(
      'End',
      new go.Node('Auto')
        .apply(nodeStyle)
        .add(
          new go.Shape('Capsule', { toLinkable: true }).apply(shapeStyle).theme('fill', 'end'),
          new go.TextBlock('End', { margin: new go.Margin(5, 6) }).apply(textStyle).bind('text')
        )
    );

    this.myDiagram.nodeTemplateMap.add(
      'Comment',
      new go.Node('Auto').apply(nodeStyle)
        .add(
          new go.Shape('File', { strokeWidth: 3 }).theme('fill', 'div').theme('stroke', 'comment'),
          new go.TextBlock({
            font: '9pt Figtree, sans-serif',
            margin: 8,
            maxSize: new go.Size(200, NaN),
            wrap: go.Wrap.Fit,
            textAlign: 'center',
            editable: true
          })
            .theme('stroke', 'bgText')
            .bindTwoWay('text')
          // no ports, because no links are allowed to connect with a comment
        )
    );

// definition mtaa les nodes mtaa plette
    this.myPalette.nodeTemplateMap.add(
      '', // the default category , '' : 
      new go.Node('Auto').apply(nodeStyle) //Crée un nœud avec un layout automatique ('Auto'), ce qui signifie que son contenu sera ajusté à sa forme.
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
            wrap: go.Wrap.Fit,// Active le retour à la ligne si le texte dépasse la largeur maximale.
            editable: true // Le texte peut être modifié par l'utilisateur.
          })
            .apply(textStyle)
            .bindTwoWay('text')
        )
    );

    this.myPalette.nodeTemplateMap.add(
      'Conditional',
      new go.Node('Auto').apply(nodeStyle)
        .add(
          new go.Shape('Conditional', { fromLinkable: true, toLinkable: true }).apply(shapeStyle).theme('fill', 'conditional'),
          new go.TextBlock({
            margin: 8,
            maxSize: new go.Size(160, NaN),
            wrap: go.Wrap.Fit,
            textAlign: 'center',
            editable: true
          })
            .apply(textStyle)
            .bindTwoWay('text')
        )
    );

    this.myPalette.nodeTemplateMap.add(
      'Start',
      new go.Node('Auto')
        .apply(nodeStyle)
        .add(
          new go.Shape('Capsule', { fromLinkable: true }).apply(shapeStyle).theme('fill', 'start'),
          new go.TextBlock('Start', { margin: new go.Margin(5, 6) }).apply(textStyle).bind('text') //Liaison simple (bind('text')) → Peut afficher un texte dynamique, mais pas bidirectionnellement.
        )
    );

    this.myPalette.nodeTemplateMap.add(
      'End',
      new go.Node('Auto')
        .apply(nodeStyle)
        .add(
          new go.Shape('Capsule', { toLinkable: true }).apply(shapeStyle).theme('fill', 'end'),
          new go.TextBlock('End', { margin: new go.Margin(5, 6) }).apply(textStyle).bind('text')
        )
    );

    this.myPalette.nodeTemplateMap.add(
      'Comment',
      new go.Node('Auto').apply(nodeStyle)
        .add(
          new go.Shape('File', { strokeWidth: 3 }).theme('fill', 'div').theme('stroke', 'comment'),
          new go.TextBlock({
            font: '9pt Figtree, sans-serif',
            margin: 8,
            maxSize: new go.Size(200, NaN),
            wrap: go.Wrap.Fit,
            textAlign: 'center',
            editable: true
          })
            .theme('stroke', 'bgText')
            .bindTwoWay('text')
          // no ports, because no links are allowed to connect with a comment
        )
    );
    
    // Définir un gabarit pour l’espaceur (élément invisible)
    this.myPalette.nodeTemplateMap.add('Spacer',
      $(go.Node, { selectable: false, movable: false },
      $(go.TextBlock, '', { margin: new go.Margin(40, 0, 0, 0) }) // Décale vers le bas
     )
     );

    //////////////
    this.myPalette.nodeTemplateMap.add('Title',
      $(go.Node, 'Auto',
        { selectable: false, locationSpot: go.Spot.Center }, // Désactive la sélection du titre
        $(go.Shape, 'RoundedRectangle',
          { fill: '#E4ECF7', strokeWidth: 0, height: 30, width: 180 } // Fond bleu clair
        ),
        $(go.TextBlock,
          { margin: 5, font: 'bold 12px sans-serif', stroke: 'gray' },
          new go.Binding('text', 'text')
        )
      )
    );
    
    /////////////////

    

    // replace the default Link template in the linkTemplateMap
    this.myDiagram.linkTemplate = new go.Link({
      routing: go.Routing.AvoidsNodes, // hedhy maaneha les links maytaadewch fou9 les noueds
      curve: go.Curve.JumpOver, //el pont eli teta3mel , ki yetaada link fou9 link
      corner: 5, //fel doura mtaa el link , nzidou arrondi
      toShortLength: 4, //el link mayouslech lel noeud , ye9ef houwa wel fleche 9ad9ad (esthetiquement khir)
      relinkableFrom: true,
      relinkableTo: true,
      reshapable: true,
      resegmentable: true,
      // hehdom bech ki nhouvri 3al link el couleur yetbedel 
      mouseEnter: (e: go.InputEvent, thisObj: go.GraphObject) => {
        const link = thisObj instanceof go.Link ? thisObj : null;
        if (link) {
          const highlight = link.findObject('HIGHLIGHT');
          if (highlight instanceof go.Shape) {
            highlight.stroke = link.diagram?.themeManager?.findValue('linkOver', 'colors') as string || 'black';
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
      }
      
    })
      .bindTwoWay('points')
      .add(
        // the highlight shape, normally transparent
        new go.Shape({
          isPanelMain: true,
          strokeWidth: 8,
          stroke: 'transparent',
          name: 'HIGHLIGHT'
        }),
        // the link path shape
        new go.Shape({ isPanelMain: true, strokeWidth: 2 })
          .theme('stroke', 'link'),
        // the arrowhead
        new go.Shape({ toArrow: 'standard', strokeWidth: 0, scale: 1.5 })
          .theme('fill', 'link'),
        // the link label
        new go.Panel('Auto', { visible: false }) //par defaut maydhhorch el label eli wra el link , 
          .bind('visible', 'text', (t) => typeof t === 'string' && t.length > 0) //ken fama text ywali ydhhor el label , fou9 el link
          .add(
            // nzidou forme cercle degradé wra el label , bech twali lisible akther
            new go.Shape('Ellipse', { strokeWidth: 0 })
            .theme('fill', 'div', undefined, undefined, c => new go.Brush("Radial", { 0: c, 0.5: `${c}00` })),

            new go.TextBlock({
                name: 'LABEL',
                font: '9pt Figtree, sans-serif',
                margin: 3,
                editable: true
              })
              .theme('stroke', 'bgText')
              .bindTwoWay('text')
          )
      );

    // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
    this.myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Routing.Orthogonal;
    this.myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Routing.Orthogonal;
   
   
   
   
   
   
   
   
   
  ////////////////////////////////////// 
    this.load();

    // this.myPalette = new go.Palette('myPaletteDiv', {
    //   nodeTemplateMap: this.myPalette.nodeTemplateMap, // share the templates used by myDiagram

    //   themeManager: this.myDiagram.themeManager, // share the ThemeManager used by myDiagram
    //   model: new go.GraphLinksModel([
    //     // specify the contents of the Palette
    //     { text: '', category: 'Spacer' }, // Ajoute un espace en haut
    //     { category: 'Start', text: 'Start' },
    //     { category: 'End', text: 'End' },
    //     { text: 'Intent' },
    //     { text: 'Sleep' },
    //     { text: 'Cmd stage' },

    //     { category: 'Conditional', text: '???' },
        
    //     { category: 'Comment', text: 'Comment' }
    //   ])
    // });


//////////////
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
      ])
    });
 ////////////   
    
  }

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
      const radius = Math.min(w, h) * 0.2; // Rayon des coins arrondis (20% de la plus petite dimension)
      const geo = new go.Geometry();
      const fig = new go.PathFigure(radius, 0, true); // Début du chemin
  
      geo.add(fig);
      
      // Ligne supérieure droite avec coin arrondi
      fig.add(new go.PathSegment(go.SegmentType.Line, w - radius, 0));
      fig.add(new go.PathSegment(go.SegmentType.Arc, 270, 90, w - radius, radius, radius, radius));
  
      // Ligne droite droite avec coin arrondi
      fig.add(new go.PathSegment(go.SegmentType.Line, w, h - radius));
      fig.add(new go.PathSegment(go.SegmentType.Arc, 0, 90, w - radius, h - radius, radius, radius));
  
      // Ligne inférieure avec coin arrondi
      fig.add(new go.PathSegment(go.SegmentType.Line, radius, h));
      fig.add(new go.PathSegment(go.SegmentType.Arc, 90, 90, radius, h - radius, radius, radius));
  
      // Ligne gauche avec coin arrondi
      fig.add(new go.PathSegment(go.SegmentType.Line, 0, radius));
      fig.add(new go.PathSegment(go.SegmentType.Arc, 180, 90, radius, radius, radius, radius));
  
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
    
    const savedModel = document.getElementById('mySavedModel') as HTMLTextAreaElement;
    if (savedModel) {
      savedModel.value = this.myDiagram.model.toJson();
      this.myDiagram.isModified = false;
    }
  }


  
  load(): void {
    if (!this.myDiagram) return;

    const savedModel = document.getElementById('mySavedModel') as HTMLTextAreaElement;
    if (savedModel) {
      this.myDiagram.model = go.Model.fromJson(savedModel.value);
    }
  }

  // print the diagram by opening a new window holding SVG images of the diagram contents for each page
  printDiagram(): void {
    if (!this.myDiagram) return;

    const svgWindow = window.open();
    if (!svgWindow) return;

    svgWindow.document.title = "GoJS Flowchart";
    svgWindow.document.body.style.margin = "0px";

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
          background: "white"
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

  // changeTheme(): void {
  //   if (!this.myDiagram) return;

  //   const themeInput = document.getElementById('theme') as HTMLSelectElement;
  //   if (themeInput) {
  //     const selectedTheme = themeInput.value;
  //     const colors = selectedTheme === 'dark' ? {
  //       background: '#141e37',
  //       text: '#fff',
  //       step: '#414a8d',
  //       conditional: '#88afa2',
  //       comment: '#bfb674',
  //       link: '#fdb71c',
  //       linkOver: '#475569'
  //     } : {
  //       background: '#ede9e0',
  //       text: '#000',
  //       step: '#49939e',
  //       conditional: '#6a9a8a',
  //       comment: '#a691cc',
  //       link: '#dcb263',
  //       linkOver: '#cbd5e1'
  //     };

  //     this.myDiagram.div!.style.background = colors.background;
  //     this.myDiagram.nodes.each(node => {
  //       const textObject = node.findObject('TEXT');
  //       if (textObject instanceof go.TextBlock) {
  //         textObject.stroke = colors.text;
  //       }
        
  //     });
  //     console.log("Changement du thème en :", selectedTheme);
  //   }
    
  // }

  changeTheme(): void {
    const myDiagram = go.Diagram.fromDiv('myDiagramDiv');
    if (myDiagram) {
      const themeElement = document.getElementById('theme') as HTMLSelectElement;
      if (themeElement) {
        myDiagram.themeManager.currentTheme = themeElement.value;
      }
    }
  }

  


  
}


