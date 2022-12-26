
var colors = [

            // background, line, highlight line

            // red
            //["F5F0EA", "D1604E", "D1604E"],

            // green
            //["F5F0EA", "0F7173", "0F7173"],

            // blue
            //["F5F0EA", "0B4F6C", "0B4F6C"],

            ["EBE8E3", "1763A8", "1763A8"],
            ["EBE8E3", "F3BA08", "F3BA08"],
            ["EBE8E3", "F21805", "F21805"],
            ["EBE8E3", "000000", "000000"]
];

//var simpleColors = ['1763A8', 'F3BA08', 'F21805', '000000', 'stripes'];
var simpleColors = ['EC6B56', '2C2729'];
var workingColors = [];

function getNextColor(not) {
    if (workingColors.length === 0) {
        for (let i = 0; i < simpleColors.length; i++) {
            workingColors.push(simpleColors[i]);
        }
        shuffleArray(workingColors);
    }
    //console.log('avoid = ' + not);
    //console.log('working colors = ' + workingColors);
    if (not.length > 0) {
        while (('#' + workingColors[workingColors.length - 1]) === not) {
            //console.log('shuffle so there is no repeat!');
            shuffleArray(workingColors);
        }
    }
    return '#' + workingColors.pop();
}

var paletteIndex;
let limit;
var rbw = 2;
var globalSum = 0;
var globalNumVisited = 0;

function rb(a, b) {
    return a + (b - a) * fxrand();
}

function randomColor() {
  let pi = Math.floor(rb(0, colors.length));
  return ('#' + colors[pi][1]);
}

function randomColorNot(not) {
    let c = randomColor();
    while (c === not) {
        c = randomColor();
    }
    return c;
}

// all the state that needs to be set/initialized before calling setup for the first time
function init() {
    fxrand = sfc32(...hashes)
    paletteIndex = Math.floor(rb(0, colors.length));

    let limiterList = [0.009, 0.0115, 0.0125];
    //let limiterList = [0.005, 0.0115, 0.0125];
    shuffleArray(limiterList);
    limit = limiterList.pop();
    //console.log('limit = ' + limit);
    globalSum = 0;
}

init();

function setup() {

  randomSeed(fxrand());

  var h = window.innerHeight;
  var w = h;

  // flip it if window is narrow width
  if (window.innerWidth < w) {
    w = window.innerWidth;
    h = w;
  }

  //console.log('width ' + w);
  //console.log('height ' + h);

  rbw = w/360;
  let num = 9;

  let margin = w/(num+2);
  let block = margin;
  //console.log('block ' + block);
  //console.log('small dim ' + smalldim);

  createCanvas(w, h);

  //var smalldim =  Math.floor(Math.min(w, h));
  //console.log('small dim: ' + smalldim);
  //  I ve had to fuss with that on other projects too. Basically limit the canvas size slightly by a modulo of window size.
  // I tend to work in proportions, so dividing by 2, 4, 10, etc.

  var boring = 0;
  while (boring < 180) {
  globalSum = 0;

  //var colors = ['#2AA590', '#F0386B', '#CC3336', '#7CC6FE'];
  // teal blue red orange
  var colors = ['#18A999', '#2998C7','#BA1200', '#E98A15'];
  var colorIndex = pickIndex(colors);
  fill(colors[colorIndex]);
  var bgcolors = ['#EAE4D4', '#EAE4D4', '#EAE4D4', '#EAE4D4'];
  background(bgcolors[colorIndex]);
  // teal yellow red blue

  var pegs = {};

/*
              // x,y, RADIUS
              // TESTNG
              //2 : [.78*w, .25*h, h/16],
              //3 : [.5*w, .5*h, h/8]

              1 : [.2*w, .25*h, h/6],
              2 : [.75*w, .2*h, h/8],
              3 : [.35*w, .85*h, h/32],
              4 : [.82*w, .78*h, h/8],
              5 : [.5*w, .5*h, h/32],

              };

  pegs = {

              // x,y, RADIUS
              // TESTNG
              //2 : [.78*w, .25*h, h/16],
              //3 : [.5*w, .5*h, h/8]

              1 : [.2*w, .25*h, h/6],
              2 : [.75*w, .2*h, h/8],
              3 : [.35*w, .85*h, h/32],
              4 : [.82*w, .78*h, h/8],
              5 : [.5*w, .5*h, h/32],

              };
              */

  var allSizes = [h/64,h/32,h/16];

  pegs = {};
  var pegNum = 1;
  var gridSize = pick([3,4,5]);
  var colwidth = w/(gridSize+1);


  var minPegNum = pick([4,5,6,7]);
  while (pegNum < minPegNum) {
  //while (pegNum != 4) {

      pegs = {};
      pegNum = 1;
      var odds = pick([0.25, 0.25, 0.25]);

      for (var i = 1; i <= gridSize; i++) {
        for (var j = 1; j <= gridSize; j++) {
          //console.log(' i = ' + i*colwidth);
          //console.log(' j = ' + j*colwidth);
          //circle(i*colwidth,j*colwidth,10);
          if (od(odds)) {
              pegs[pegNum++] = [i*colwidth,j*colwidth,pick(allSizes)];
          }
        }
      }
  }

  if (pegNum < 3) {
    //console.log('how is it 0?');
  }


  noStroke();

  // TODO: draw stuff

  // draw all pegs
  for (var key in pegs) {
    //fill(pick(colors));
    circle(pegs[key][0], pegs[key][1], pegs[key][2]*2);
  }

  var allPegs = [];
  var neverVisited = {};
  for (var key in pegs) {
    allPegs.push(key);
    neverVisited[key] = 10;
  }

  // TODO: hard coded
  var startPeg = pick(allPegs);
  var returnHome = startPeg;

  // which other peg to go to?
  var otherPegs = copyRemove(allPegs, startPeg);
  //console.log('other pegs = ' + otherPegs);

  var endPeg = pick(otherPegs);

  // BIZ LOGIC

  var iterations = pick([3,4,5]);
  //var iterations = 3;
  var pso = null;
  var homePso = null;

  while (iterations > 0) {
   
      pso = drawPulley(pegs, startPeg, endPeg, w, h, pso);
      if (homePso == null) {
          homePso = pso;
      }
      delete neverVisited[startPeg];
      delete neverVisited[endPeg];

      stroke('#000000');
      strokeWeight(w/200);
      //line(10,10,20,20);
      noStroke();

      // iterate
      iterations--;

      startPeg = endPeg;
      //console.log('new start at = ' + startPeg);

      // which other peg to go to?
      //var otherPegs = copyRemove(allPegs, startPeg);

      var otherPegs = [];
      for (var key in neverVisited) {
        otherPegs.push(key);
      }
      if (otherPegs.length == 0) {
        break;
      }


      endPeg = pick(otherPegs);
      //endPeg = 1;
      //console.log('go to = ' + endPeg);
      //console.log('never visited = ' + objToString(neverVisited));

  }

/*
  // DEBUG
  startPeg = 4;
  returnHome = startPeg;
  endPeg = 1;
  pso = drawPulley(pegs, startPeg, endPeg, w, h, pso);
  homePso = pso;

  startPeg = endPeg;
  endPeg = 3;
  pso = drawPulley(pegs, startPeg, endPeg, w, h, pso);

  startPeg = endPeg;
  endPeg = 5;
  pso = drawPulley(pegs, startPeg, endPeg, w, h, pso);

  startPeg = endPeg;
  endPeg = 4;
  // END DEBUG
  */
   
  // return home, on opposite side
  //console.log('resume on = ' + startPeg);
  //console.log('return home to = ' + returnHome);
  //console.log('already home = ' + samePeg(startPeg, returnHome));

  if (!samePeg(startPeg, returnHome)) {
    pso = drawPulley(pegs, startPeg, returnHome, w, h,pso);
  }

  //console.log('home pso start peg = ' + homePso.startPeg);
  //console.log('home pso end peg = ' + homePso.endPeg);

  // draw cap at home. need home state pso, plus previous pso = WORKS!

  // move to start peg
  translate(pegs[homePso.startPeg][0], pegs[homePso.startPeg][1]);
  rotate(homePso.offset);
  rotate(homePso.a1);

  drawEndCap(
      homePso.a1,
      homePso.offset,
      pegs,
      homePso.startPeg,
      homePso.endPeg,
      w,
      h,
      pso,
      homePso.a2,
      homePso.xs,
      homePso.ys,
      homePso.xsc,
      homePso.ysc,
      true,homePso);

  rotate(-homePso.a1);
  rotate(-homePso.offset);
  translate(-pegs[homePso.startPeg][0], -pegs[homePso.startPeg][1]);
   
  // check that all rotates, translations are back to normal
  //circle(10,10,10);

  var numNotVisited = 0;
  for (var key in neverVisited) {
    numNotVisited++;
  }

  var stat1 = pegNum-1;
  var stat2 = stat1 - numNotVisited;
   
  var boring = (globalSum/stat2);
  //console.log('ratio for bad drawing = ' + boring);
  if (boring < 180) {
    //console.log('REDO!');
    clear();
  }
  }

  var colorName = 'unknown';
  if (colorIndex == 0) {
    colorName = 'teal';
  } 
  else if (colorIndex == 1) {
    colorName = 'blue';
  }
  else if (colorIndex == 2) {
    colorName = 'red';
  }
  else if (colorIndex == 3) {
    colorName = 'orange';
  }

  options = {
  '# of pegs total' : stat1,
  '# of pegs visited' : stat2,
  'all visited' : (stat1 == stat2),
  'color' : colorName
  }
  //console.log(cutDescription);

  //console.log(options);

  window.$fxhashFeatures = {
    ...options
  }
}

function objToString (obj) {
    var str = '';
    for (var p in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, p)) {
            str += p + '::' + obj[p] + '\n';
        }
    }
    return str;
}

function samePeg(peg1, peg2) {
    return str(peg1) === str(peg2);
}

function drawPulley(pegs, startPeg, endPeg, w, h, pso) {

      //console.log('start at = ' + startPeg);
      //console.log('end at = ' + endPeg);
      stroke('#000000');
      //line(w/2,h/2,w/2+30,h/2);

/*
      console.log('prev state object = ' + pso);
      if (pso) {
        console.log('prev state object xe = ' + pso.xe);
        console.log('prev state object ye = ' + pso.ye);
        console.log('prev state object xec = ' + pso.xec);
        console.log('prev state object yec = ' + pso.yec);
      }
      */

      var currentStateObject = {};

      // draw line center to center start peg to end peg - DONE
      var ydiff = pegs[endPeg][1] - pegs[startPeg][1];
      //console.log('y diff = ' + ydiff);

      var xdiff = pegs[endPeg][0] - pegs[startPeg][0];
      //console.log('x diff = ' + xdiff);

      var a1 = Math.atan(ydiff/xdiff);
      //console.log('a1 = ' + degrees(a1));

      var offset = 0;
      if (xdiff < 0) {
          offset = Math.PI; 
      }
       
      // move to start peg
      translate(pegs[startPeg][0], pegs[startPeg][1]);
      // offset by 180 degrees depending on if destination peg is "behind" start peg (x-axis)
      rotate(offset);
      // rotate according to angle from center to center
      rotate(a1);

      stroke('#000000');
      strokeWeight(w/400);
      //line(0,0,w,0);
       
      // assuming ending peg is bigger
      // distance between the centers is??
      // this dist is the correct length
      var dist = Math.sqrt(Math.pow(Math.abs(pegs[startPeg][0] - pegs[endPeg][0]), 2) + Math.pow(Math.abs(pegs[startPeg][1] - pegs[endPeg][1]), 2));
      //console.log('dist = ' + dist);
      //console.log('w = ' + w);

      var rdiff = pegs[endPeg][2] - pegs[startPeg][2];
      //console.log('radius diff = ' + rdiff);

      var a2 = Math.asin(rdiff/dist);
      //console.log('a2 = ' + degrees(a2));

      // start, corner touching peg
      var xs = pegs[startPeg][2]* Math.sin(a2);
      var ys = pegs[startPeg][2]* Math.cos(a2);
      //console.log('xs = ' + xs);
      //console.log('ys = ' + ys);
      //line(0,0,0,-ys);
      //line(0,-ys,-xs,-ys);

      // start, next corner
      var xsc = (pegs[startPeg][2]+rbw)* Math.sin(a2);
      var ysc = (pegs[startPeg][2]+rbw)* Math.cos(a2);
      //console.log('xsc = ' + xsc);
      //console.log('ysc = ' + ysc);
      //line(0,0,0,-ysc);
      //line(0,-ysc,-xsc,-ysc);


      // end, corner touching peg
      var xe = pegs[endPeg][2]* Math.sin(a2);
      var ye = pegs[endPeg][2]* Math.cos(a2);
      //line(dist,0,dist,-ye);
      //line(dist,-ye,dist-xe,-ye);

      // end, next corner
      var xec = (pegs[endPeg][2]+rbw)* Math.sin(a2);
      var yec = (pegs[endPeg][2]+rbw)* Math.cos(a2);
      //line(dist,0,dist,-yec);
      //line(dist,-yec,dist-xec,-yec);

      // find the rubber band anchor point on each circle. then draw line connecting them - DONE
      // pulley line
      //line(-xs,-ys,dist-xe,-ye);

      // GOOD
      // pulley rubber band
      noStroke();
      fill('#000000');
      beginShape();
      vertex(-xs,-ys);
      vertex(dist-xe,-ye);
      vertex(dist-xec,-yec);
      vertex(-xsc,-ysc);
      endShape(CLOSE);
      // END GOOD

      // WORK IN PROGRESS end cap part of rubber band
      // custom shape
      // draw dots along the circle at 2 radius = actual radius and radius + rbw
      // start at point that the connector ended on


      currentStateObject['xe'] = xe;
      currentStateObject['ye'] = ye;
      currentStateObject['xec'] = xec;
      currentStateObject['yec'] = yec;

      currentStateObject['xs'] = xs;
      currentStateObject['ys'] = ys;
      currentStateObject['xsc'] = xsc;
      currentStateObject['ysc'] = ysc;


      currentStateObject['translateX'] = pegs[startPeg][0];
      currentStateObject['translateY'] = pegs[startPeg][1];
      currentStateObject['offset'] = offset;
      currentStateObject['a1'] = a1;
      currentStateObject['a2'] = a2;
      currentStateObject['dist'] = dist;
      currentStateObject['startPeg'] = startPeg;
      currentStateObject['endPeg'] = endPeg;

      if (pso && pso.translateX) {
          drawEndCap(a1,offset,pegs,startPeg,endPeg,w,h,pso,a2,xs,ys,xsc,ysc,false,currentStateObject);
      }

      //rotate(-a2);
      //line(0,0,w,0);
      //line(-xs,-ys,199,100);
      //rect(-xs,-ys,100,10);
      //rotate(a2);
      
      noStroke();
       
      // undo all the transformations
      //translate(0,-pegs[startPeg][2]);
      rotate(-a1);
      rotate(-offset);
      translate(-pegs[startPeg][0], -pegs[startPeg][1]);
      // END BIZ LOGIC
       
      return currentStateObject;

}

function drawEndCap(a1,offset,pegs,startPeg,endPeg,w,h,pso,a2,xs,ys,xsc,ysc,home,cso) {
          //console.log('capping off home = ' + home);


          // use prev state object to draw the cap where previous step left off
          // undo current state DONE
          rotate(-a1);
          rotate(-offset);
          translate(-pegs[startPeg][0], -pegs[startPeg][1]);
           
          stroke('#000000');
          //line(w/2,h/2,w/2+60,h/2);
          //line(0,0,10,10);

           


          // push prev state
          translate(pso.translateX, pso.translateY);
          rotate(pso.offset);
          rotate(pso.a1);
          //line(0,0,10,10);

          // draw stuff
          //circle(pso.dist-pso.xe,-pso.ye, 10);
          //circle(pso.dist-pso.xec,-pso.yec, 10);
          //console.log('pso a2 = ' + degrees(pso.a2)); 
          //TODO: translate a2 to new coordinates or just angle

          // angle offset and a1
          // angle pso.offset and pso.a1
          //console.log('cap prev = ' + degrees(pso.offset+pso.a1));
          //console.log('cap current = ' + degrees(offset+a1));

          var master = offset + a1 - pso.offset - pso.a1 + pso.a2;

          //var mxs = pegs[startPeg][2]* Math.sin(master);
          //var mys = pegs[startPeg][2]* Math.cos(master);

          // undo prev state
          rotate(-pso.a1);
          rotate(-pso.offset);
          translate(-pso.translateX, -pso.translateY);


          // put back current state DONE
          translate(pegs[startPeg][0], pegs[startPeg][1]);
          rotate(offset);
          rotate(a1);

          //line(0,0,mxs,mys);
          //line(0,0,1000,0);
           

    /*
          var wrapResolution = Math.PI*2/48;
          var wrapIterations = 2;
          var aw = a2;
          var xep1 = xe;
          var yep1 = ye;
          var xep2 = xec;
          var yep2 = yec;
          while (wrapIterations > 0) {
              stroke('#000000');
              strokeWeight(w/400);

              var aw = aw - wrapResolution;

              // end, corner touching peg
              var xe1 = pegs[endPeg][2]* Math.sin(aw);
              var ye1 = pegs[endPeg][2]* Math.cos(aw);
              //line(dist,0,dist,-ye1);
              //line(dist,-ye1,dist-xe1,-ye1);

              // end, next corner
              var xe2 = (pegs[endPeg][2]+rbw)* Math.sin(aw);
              var ye2 = (pegs[endPeg][2]+rbw)* Math.cos(aw);
              //line(dist,0,dist,-ye2);
              //line(dist,-ye2,dist-xe2,-ye2);

              // START pulley circle wrap
              noStroke();
              fill('#000000');
              beginShape();
              vertex(dist-xep1,-yep1);
              vertex(dist-xep2,-yep2);

              vertex(dist-xe2,-ye2);
              vertex(dist-xe1,-ye1);

              endShape(CLOSE);
              // END 

              xep1 = xe1;
              yep1 = ye1;
              xep2 = xe2;
              yep2 = ye2;

              wrapIterations--;
          }
          */

          //var capEndAngle = 220;
          var capEndAngle = degrees(master);

          var wrapResolution = Math.PI*2/180;
          var wrapIterations = 1720;
          var aw = a2;
          var xsp1 = xs;
          var ysp1 = ys;
          var xsp2 = xsc;
          var ysp2 = ysc;
          //circle(-xs,-ys,10);
          //circle(-xsc,-ysc,10);
          var flipFlop = true;

          //console.log('start at a2/aw = ' + aw);
          //console.log('master pre = ' + degrees(master));

          var normalDirection; 
          if (degrees(aw) < capEndAngle) {
            normalDirection = true;
          } else {
            normalDirection = false;
            //console.log('must flip direction!');
            master = normalizeAngle(master);
            capEndAngle = degrees(master);
          }
          //console.log('master post = ' + degrees(master));

          var capAngleBuffer = 4;
          var customVertices = [];
          var customVerticesBottom = [];
          while (wrapIterations > 0) {

              strokeWeight(w/400);

              var aw = aw + wrapResolution;
              globalSum += degrees(wrapResolution);
              if (normalDirection) {
                  if (degrees(aw) - capEndAngle > capAngleBuffer) {
                    //console.log('we break!');
                    //console.log('we break aw working = ' + degrees(aw));
                    //console.log('we break end condition = ' + capEndAngle);
                    break;
                  }

              } else {
                if (degrees(aw) - capEndAngle > capAngleBuffer) {
                    //console.log('we break!');
                    //console.log('we break aw working = ' + degrees(aw));
                    //console.log('we break end condition = ' + capEndAngle);
                    break;
                }
              }

              //console.log('wrap current angle: ' + degrees(aw));


              // end, corner touching peg
              var xs1 = pegs[startPeg][2]* Math.sin(aw);
              var ys1 = pegs[startPeg][2]* Math.cos(aw);
              //line(dist,0,dist,-ye1);
              //line(dist,-ye1,dist-xe1,-ye1);

              // end, next corner
              var xs2 = (pegs[startPeg][2]+rbw)* Math.sin(aw);
              var ys2 = (pegs[startPeg][2]+rbw)* Math.cos(aw);
              //line(dist,0,dist,-ye2);
              //line(dist,-ye2,dist-xe2,-ye2);

              // START pulley circle wrap
              noStroke();
              if (flipFlop) {
                fill('#000000');
              } else {
                fill('#000000');
              }
              flipFlop = !flipFlop;

/*
              beginShape();
              vertex(-xsp1,-ysp1);
              vertex(-xsp2,-ysp2);

              vertex(-xs2,-ys2);
              vertex(-xs1,-ys1);

              endShape(CLOSE);
              */
              // END 

              //circle(-xsp1,-ysp1,10);
              //circle(-xsp2,-ysp2,10);
              customVertices.push([-xsp2,-ysp2]);
              customVerticesBottom.push([-xsp1,-ysp1]);

              //circle(-xs2,-ys2,10);
              //circle(-xs1,-ys1,10);


              xsp1 = xs1;
              ysp1 = ys1;
              xsp2 = xs2;
              ysp2 = ys2;

              wrapIterations--;
          }
          beginShape();
          for (var i = 0; i < customVertices.length; i++) {
            vertex(customVertices[i][0],customVertices[i][1]);
            //console.log('vertex x = ' + customVertices[i][0]);
            //console.log('vertex y = ' + customVertices[i][1]);
          }
          for (var i = customVerticesBottom.length-1; i >= 0; i--) {
            vertex(customVerticesBottom[i][0],customVerticesBottom[i][1]);
            //console.log('vertex x = ' + customVertices[i][0]);
            //console.log('vertex y = ' + customVertices[i][1]);
          }

          endShape(CLOSE);

}
 
function normalizeAngle(angle) {
    //while (angle <= 0) {
        angle += Math.PI*2.0;
    //}
    return angle;
}
 
function copyRemove(arrToCopy, elementToRemove) {

    var newArr = [];
    for (var i = 0; i < arrToCopy.length; i++) {
        if (str(arrToCopy[i]) !== str(elementToRemove)) {
            newArr.push(arrToCopy[i]);
        }
    }
    return newArr;
}

function degrees(a) {
    return a * 180 / Math.PI;
}
 
function fillRand(num, arr) {
  // choose a random point. 
  let rx = rint(0, num);
  let ry = rint(0, num);

  // choose a random width. 
  let rw = rint(1, num - rx)

  // choose a random height. 
  let rh = rint(1, num - ry)

  console.log('rx = ' + rx);
  console.log('ry = ' + ry);
   console.log('rw = ' + rw);
  console.log('rh = ' + rh);

  let pi = Math.floor(rb(0, colors.length));

  // TODO: see if you can fill that in. 

  for (let i = rx; i < (rx+rw); i++) {
    for (let j = ry; j < (ry+rw); j++) {
      console.log('i = ' + i);
      console.log('j = ' + j);
      // if so mark it, and go again
      arr[i][j] = ('#' + colors[pi][1]);
    }
  }

}

function randomLines(x, y, w, h, block, outer, color) {
    let numLinesDrawn = 0;
    //smalldim = block/4;
    let smalldim = block/6;
    // draw rect
    //fill('#F5F0EA');
    let savex = x;
    let savey = y;
    stroke('#' + colors[paletteIndex][1]);

    let prev = false;
    let solid = fxrand() < 0.5;
    let alt = false;
    let solidStart = -1;
    // draw random lines going down
    for (let i = y; y < h + outer - smalldim/2; y+=smalldim) {
        if (!prev) {
            // it's blank above
            if (fxrand() < limit) {
            //if (true) {
                // jackspot, start an alt
                if (alt) {
                    line(x, y, x+w,y);
                    numLinesDrawn++;
                }

                // jackpot, start a solid
                if (solid) {
                    if (solidStart === -1) {
                        //console.log('start solid ' + y);
                        solidStart = y;
                    }
                    line(x, y, x+w,y);
                    numLinesDrawn++;
                }

                // if you drew alt, flip it so you don't draw it next time
                alt = !alt;

                // currently drawing
                prev = true;
            }
        } else {
            // continue drawing the block 95% of the time
            if (fxrand() < 0.95) {

                // continue drawing alt
                if (alt) {
                    line(x, y, x+w,y);
                    numLinesDrawn++;
                } 

                // continue drawing solid
                if (solid) {
                    line(x, y, x+w,y);
                    numLinesDrawn++;
                }

                // if you drew alt, flip it so you don't draw it next time
                alt = !alt;

                // currently drawing
                prev = true;
            } else {

                // end this block
                prev = false;
                if (solid) {
                    //console.log('end solid ' + y);
                    // TODO: close the rectangle
                    //fill(color);
                    let pi = Math.floor(rb(0, colors.length));
                    fill('#' + colors[pi][2]);
                    stroke('#' + colors[pi][2]);
                    rect(x, solidStart, w, y-solidStart);
                    noFill();
                    solidStart = -1;
                }

                solid = fxrand() < 0.5;
            }
        }
    }
    if (solid && solidStart !== -1) {
        //console.log('end solid ' + y);
        // TODO: close the rectangle

        let pi = Math.floor(rb(0, colors.length));
        fill('#' + colors[pi][2]);
        stroke('#' + colors[pi][2]);
        rect(x, solidStart, w, y-solidStart);
        noFill();

        //fill(color);
        //rect(x, solidStart, w, y-solidStart);
        //noFill();
        solidStart = -1;
    }

    stroke('#000000');
    //rect(savex, savey, w, h);

    return numLinesDrawn;

}

function od(a) {
    return fxrand() <= a
}

function rint(a, b) {
    return Math.floor(rb(a, b));
}

function wc(a) {
    const b = fxrand();
    let c = 0;
    for (let e = 0; e < a.length - 1; e += 2) {
        const f = a[e],
            g = a[e + 1];
        if (c += g, b < c) return f
    }
    return a[a.length - 2]
}

function pick(a) {
    let len = a.length;
    return a[int(rb(0, len))];
}

function pickIndex(a) {
    let len = a.length;
    return int(rb(0, len));
}


function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(fxrand() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function windowResized() {
    clear();
    init();
    setup();
}


