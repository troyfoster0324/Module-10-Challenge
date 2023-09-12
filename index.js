import { coloursArray } from './coloursArray.js';
import fs from 'fs';
import path from 'path';
const __dirname = path.resolve();
import inquirer from 'inquirer';
import { Triangle, Circle, Square } from './library/shapes.js';

const canvasWidth = 300;
const canvasHeight = 200;

inquirer
  .prompt([
    {
      type: 'input',
      name: 'text',
      message: 'Enter up to three characters:',
      validate: (input) => input.length <= 3,
    },
    {
      type: 'input',
      name: 'textColor',
      message: 'Enter the text color (hexadecimal, i.e.#CD5C5C) or keyword (refer to coloursArray.js)):',
      validate: (input) => {
        
        const isColorName = coloursArray.includes(input.toLowerCase());
        
        const isHexCode = /^#[0-9A-F]{6}$/i.test(input);
        return isColorName || isHexCode;
      },
    },
    {
      type: 'list',
      name: 'shape',
      message: 'Choose a shape:',
      choices: ['Circle', 'Triangle', 'Square'],
    },
    {
      type: 'input',
      name: 'shapeColor',
      message: 'Enter the shape color (hexadecimal or keyword):',
      validate: (input) => {
       
        const isColorName = coloursArray.includes(input.toLowerCase());
        
        const isHexCode = /^#[0-9A-F]{6}$/i.test(input);
        return isColorName || isHexCode;
      },
    },
  ])

  .then((answers) => {
    let shape;
    const text = {
      _attributes: {
        x: canvasWidth / 2,
        y: canvasHeight / 1.35, // adjust height of the text, higher # = raise text, this is only for triangle! see 'switch'
        'text-anchor': 'middle',
        fill: answers.textColor,
      },
     
      _text: answers.text.toUpperCase(), 
    
      render: function() { 
        return ` 
          <text x="${this._attributes.x}" y="${this._attributes.y}" 
                text-anchor="${this._attributes['text-anchor']}"
                fill="${this._attributes.fill}" font-size="${fontSize}">
            ${this._text}
          </text>
        `;
      },
    };
    // adjust shape dimensions here, this is where the 'new' shape is created dependent on selection
    let fontSize;
    switch (answers.shape) {
      case 'Circle':
        const circleRadius = Math.min(canvasWidth, canvasHeight) * 0.45;       
        shape = new Circle(canvasWidth / 2, canvasHeight / 2, circleRadius);
        text._attributes.y = canvasHeight / 1.65;                           
        fontSize = 58;                                                          
        break;
        case 'Triangle':                                   
          const triangleHeight = Math.min(canvasWidth, canvasHeight) * 1.1;     
          shape = new Triangle(canvasWidth / 2, canvasHeight / 2, triangleHeight);
          fontSize = 52;                                                        
          break;
      case 'Square':
        const squareSize = Math.min(canvasWidth, canvasHeight) * 0.8;           // percentage of area the box takes of canvas
        shape = new Square(canvasWidth / 2, canvasHeight / 2, squareSize);
        text._attributes.y = canvasHeight / 1.65;                               
        fontSize = 60;                                                          
        break;
    }

    const svgData = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}" height="${canvasHeight}">
        ${shape.render(answers.shapeColor)}
        ${text.render()}
      </svg>`;

    fs.writeFileSync(`${__dirname}/logo.svg`, svgData.toString());

    console.log('Generated logo.svg');
  })
  .catch((error) => {
    console.error(error);
  });