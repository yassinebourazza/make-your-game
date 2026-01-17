export function BrickGenerator() {
    let layers = {
    'layer-1' :{bricks:[]},
    'layer-2' :{bricks:[]},
    'layer-3' :{bricks:[]},
    'layer-4' :{bricks:[]},
    'layer-5' :{bricks:[]},
    'layer-6' :{bricks:[]},
    'layer-7' :{bricks:[]},}
    let container = document.getElementById('container')
    let brick;
    for (let i=1 ; i<=70;i++) {
        brick = document.createElement('div')
        brick.id = 'brick-'+i
        brick.className = 'brick'
        container.appendChild(brick)

        brick= document.getElementById('brick-'+i)
        if (i%10!=0) brick.style.gridColumn = i%10
        else brick.style.gridColumn = 10
        brick.style.gridRow = Math.ceil(i/10)
        layers['layer-'+(8-Math.ceil(i/10))].bricks.push(brick)

        if (i%10==0) {
            brick = document.getElementById('brick-'+i)            
            let brickData = brick.getBoundingClientRect()    
            layers['layer-'+(8-Math.ceil(i/10))]['y'] = brickData.y
            layers['layer-'+(8-Math.ceil(i/10))]['yHeight'] = brickData.y+brickData.height
        }
    }

    console.log(layers);
    
    return layers
}