const inquirer = require('inquirer');
require('colors');

// Opciones del menu 
// si se revisa la documentación de "inquirer", se observa que las opciones se se pueden mandar como
// un string, un arreglo de string, o como un objeto que tiene el value y name
const preguntas = [
    {
        type: 'list',
        name: 'opcion',     // nombre de la variable linea 50
        message: '¿Qué desea hacer?\n'.brightWhite.italic,
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Buscar ciudad`,
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`,
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`,
            },
           
        ]
    }
];

const inquirerMenu = async () => {
    console.clear();
    console.log('============================='.brightRed);
    console.log('    Seleccione una opción'.brightGreen)
    console.log('=============================\n'.brightRed);
    // inquirer trabaja en base a promesas
    const { opcion } = await inquirer.prompt(preguntas);
    return opcion;
}

// crear una funcion que se llame pausa
const pausa = async () => {
    const question = [
        {
            type: 'input',
            name: 'enter',     // nombre de la variable linea 50
            message: `Presione ${'ENTER'.brightRed} para continuar`
        }
    ];
    console.log('\n')
    await inquirer.prompt(question)
}

const leerInput = async ( message ) => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate ( value ) {         // forzamos al usuario a ingresar un valor.
                if ( value.length === 0) {
                    return ' Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];
    const { desc } = await inquirer.prompt(question);       // se retorna la descripcion 
    return desc;
}

const listarLugares = async (lugares = []) => {
    const choices = lugares.map((lugar, i) => {
        const idx = `${i + 1}.`.green;
        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`
        }
    });
   
    choices.unshift({
        value: '0',
        name: '0.'.green + ' Cancelar'
    })

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar:'.italic,
            choices,
        }
    ]

    const { id } = await inquirer.prompt(preguntas);
    return id;
}

const confirmar = async (message) => {
    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message,
        }
    ];
    const { ok } = await inquirer.prompt(question);
    return ok; 
}

const mostrarListadoCheaklist = async (tareas = []) => {
    const choices = tareas.map((tarea, i) => {
        const idx = `${i + 1}.`.green;
        return {
            value: tarea.id,
            name: `${idx} ${tarea.desc}`,
            checked: (tarea.completadoEn) ? true : false
        }
    });
    const pregunta = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Seleccione'.italic, 
            choices
        }
    ]
    const { ids } = await inquirer.prompt(pregunta);
    return ids;
}

module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoCheaklist,
}