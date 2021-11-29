/* ==========================================================
 * bootstrap-carousel.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options = options
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      if (this.interval) clearInterval(this.interval);
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , getActiveIndex: function () {
      this.$active = this.$element.find('.item.active')
      this.$items = this.$active.parent().children()
      return this.$items.index(this.$active)
    }

  , to: function (pos) {
      var activeIndex = this.getActiveIndex()
        , that = this

      if (pos > (this.$items.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activeIndex == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      if (this.$element.find('.next, .prev').length && $.support.transition.end) {
        this.$element.trigger($.support.transition.end)
        this.cycle(true)
      }
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.item.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      e = $.Event('slide', {
        relatedTarget: $next[0]
      , direction: direction
      })

      if ($next.hasClass('active')) return

      if (this.$indicators.length) {
        this.$indicators.find('.active').removeClass('active')
        this.$element.one('slid', function () {
          var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
          $nextIndicator && $nextIndicator.addClass('active')
        })
      }

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
        , action = typeof option == 'string' ? option : options.slide
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.defaults = {
    interval: 5000
  , pause: 'hover'
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL NO CONFLICT
  * ==================== */

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }

 /* CAROUSEL DATA-API
  * ================= */

  $(document).on('click.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this = $(this), href
      , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      , options = $.extend({}, $target.data(), $this.data())
      , slideIndex

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('carousel').pause().to(slideIndex).cycle()
    }

    e.preventDefault()
  })

}(window.jQuery);(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var ActiveSites;

var isNumeric = function( n ) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};
ActiveSites = function(options) {

    // All this coordinates start in 1
    options = options || {};
    this.name = options.name || "";
    this.sites = options.active_sites || 1;
    this.proteins = options.proteins || 0;
    this.source = options.source || 0;
    this.over=-1;
};



//ActiveSites.prototype.isOver = function(){
//    if (!this.over){
//
//    }
//    this.over=true;
//}
ActiveSites.prototype.whatShouldBeDraw = function(column){
    for (var i=0; i<this.sites.length;i++) {
        if (this.sites[i].column == column) {
            this.sites[i].type = "BLOCK";
            return this.sites[i];
        }
    }
    if (this.sites[0].column<column && column<this.sites[this.sites.length-1].column) {
        this.sites[0].type = "LINE";
        return this.sites[0];
    }
    return null;
};
ActiveSites.prototype.sortSites = function(columns){
    this.sites = this.sites.sort(function(a, b) {
        if (typeof a.column == "undefined") return -1;
        if (typeof b.column == "undefined") return 1;
        return a.column - b.column;
    });
};
ActiveSites.prototype.getSitesHTML = function(column){
    var html = "<ul>";
    for (var i=0; i<this.sites.length; i++){
        var site = this.sites[i],
            css = (column==site.column)?"current_site":"";

        html += "<li class='"+css+"'><i>Column "+site.column+":</i>"+site.base+"</li>";
    }
    return html+"</ul>";
};

ActiveSites.prototype.getProteinsHTML = function(column){
    var html = "<ul>";
    for (var i=0; i<this.proteins.length; i++){
        var p =this.proteins[i];
        html += "<li><a target='_blank' href='http://www.uniprot.org/uniprot/"+p+"'>"+p+"</a></li>";
    }
    return html+"</ul>";
};
if (typeof module != "undefined")
    module.exports = ActiveSites
},{}],2:[function(require,module,exports){
"use strict";

var ActiveSites   = require("./ActiveSites.js"),
    ActiveSitesPanel = require("./ActiveSitesPanel.js");

var ActiveSitesAdder;

ActiveSitesAdder = function(data, hmm_logo) {
    this.data = data;
    this.hmm_logo = hmm_logo;
    this.panel = null;

    this.resetData = function(data) {
        this.data = data;
        this.panel = null;
    };

    this.process = function(){
        for (var i=0; i<this.data.length;i++) {//for each pattern
            var x = new ActiveSites(this.data[i]);
            this.data[i].controller=x;
            //for (var j=0;j< this.data[i].residues.length;j++) { // for each residue
            //    var col = x.getColumnFromResidue(this.data[i].residues[j].residue);
            //    if (col > 0 ) {
            //        this.data[i].residues[j].column = col;
            //        this.data[i].residues[j].base = x.sequence[this.data[i].residues[j].residue-1];
            //    }
            //}
            x.sortSites();
        }
    };

    this.setDrawingOptions = function(options){
        options.hmm_logo = this.hmm_logo;
        options.data = this.data;
        if (this.panel==null)
            this.panel = new ActiveSitesPanel(options);
    };

};

if (typeof module != "undefined")
    module.exports = ActiveSitesAdder;
},{"./ActiveSites.js":1,"./ActiveSitesPanel.js":3}],3:[function(require,module,exports){
"use strict";

var CanvasButton = require("../components/canvas_button.js");

var ActiveSitesPanel;


ActiveSitesPanel = function(options) {
    var self = this;
    this.margin_to_features = options.margin_to_features || 0;
    this.padding_between_tracks = options.padding_between_tracks || 0;
    this.feature_height = options.feature_height || 10;

    this.hmm_logo = options.hmm_logo || null;
    this.data = options.data || null;

    this.canvas = null;
    this.context =null;
    this.components =[];

    var top = 1 + this.margin_to_features+this.padding_between_tracks+this.feature_height/ 2,
        w = this.feature_height* 2,
        h = this.feature_height*6;

    this.offsetY=0;
    this.top_limit=0;
    this.bottom_limit=h-2*this.feature_height;

    this.addedEvents=false;

    var up_button   = new CanvasButton({x:3, y: top+2,     w: w-6, h: w-6}),
        down_button = new CanvasButton({x:3, y: top+h-w+2, w: w-6, h: w-6});

    this.components.push(up_button);
    this.components.push(down_button);

    // create an empty <span>
    var dragImgEl = document.createElement('span');
    dragImgEl.setAttribute('style',
        'position: absolute; display: block; top: 0; left: 0; width: 0; height: 0;' );
    document.body.appendChild(dragImgEl);

    up_button.draw = function(context){
        draw_polygone(context,[
            [this.x+this.w/2, this.y],
            [this.x, this.y+this.h],
            [this.x+this.w, this.y+this.h]],
            (this.getState()==this.STATE_NORMAL)?"rgba(255,100,10, 0.3)":"rgba(255,100,10, 1)"
        );
    };
    down_button.draw = function(context){
        draw_polygone(context,[
                [this.x+this.w/2, this.y+this.h],
                [this.x, this.y],
                [this.x+this.w, this.y]],
            (this.getState()==this.STATE_NORMAL)?"rgba(255,100,10, 0.3)":"rgba(255,100,10, 1)"
        );
    };

    up_button.onClick = function(){
        self.offsetY = (self.offsetY<=self.bottom_limit)?self.bottom_limit:self.offsetY-1;
        self.hmm_logo.refresh();
    };
    down_button.onClick = function(){
        self.offsetY = (self.offsetY>=self.top_limit)?self.top_limit:self.offsetY+1;
        self.hmm_logo.refresh();
    };

    this.getMouse = function (e) {
        var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;

        // Compute the total offset
        if (element.offsetParent !== undefined) {
            do {
                offsetX += element.offsetLeft;
                offsetY += element.offsetTop;
            } while ((element = element.offsetParent));
        }

        // Add padding and border style widths to offset
        // Also add the offsets in case there's a position:fixed bar
        offsetX += getAmountFromStyle(this.canvas, "paddingLeft") + getAmountFromStyle(this.canvas, "borderLeft") + getAmountFromStyle(this.canvas, "left");
        offsetY += getAmountFromStyle(this.canvas, "paddingTop") + getAmountFromStyle(this.canvas, "borderTop") + getAmountFromStyle(this.canvas, "top");

        mx = e.pageX - offsetX;
        my = e.pageY - offsetY;

        // We return a simple javascript object (a hash) with x and y defined
        return {x: mx, y: my};

    };
    this.initialize_2nd_axis = function(second_axis){
        second_axis = this.hmm_logo.render_2nd_y_axis_label();
        return second_axis;
    };
    this.addEvents = function(second_axis,logo_canvas){
        second_axis.addEventListener('mousemove', function(e) {
            var mouse = self.getMouse(e),
                refresh = false;

            for (var i=0;i<self.components.length;i++) {
                var previous = self.components[i].getState();
                self.components[i].mousemove(mouse);
                if (previous != self.components[i].getState())
                    refresh=true;
            }
            if(refresh)
                self._paint_2nd_axis();
        });
        second_axis.addEventListener('click', function(e) {
            var mouse = self.getMouse(e);
//            for (var i=0;i<self.components.length;i++)
//                self.components[i].click(mouse);
        });
        second_axis.addEventListener('mousedown', function(e) {
            var mouse = self.getMouse(e);
            self.timer = setInterval( function(){
                for (var i=0;i<self.components.length;i++)
                    self.components[i].click(mouse);

            }, 20 );

        });
        second_axis.addEventListener('mouseup', function(e) {
            var mouse = self.getMouse(e);
            clearInterval(self.timer);
            for (var i=0;i<self.components.length;i++)
                self.components[i].click(mouse);
        });
        var y_axis = document.getElementsByClassName("logo_yaxis")[0],
            prevY=null;

        y_axis.addEventListener('dragstart', function(e) {
            //e.dataTransfer.setDragImage(null,0,0);

            e.dataTransfer.setDragImage(dragImgEl, 0, 0);
            var mouse = self.getMouse(e);
            if (top< mouse.y && mouse.y<top+h-self.feature_height) {
                prevY=mouse.y;
            }
        });

        y_axis.addEventListener('drag', function(e) {
            var mouse = self.getMouse(e);
            if (top< mouse.y && mouse.y<top+h-self.feature_height) {
                if (prevY!=null) {
                    var deltaY = mouse.y - prevY;
                    if (self.offsetY + deltaY>= self.top_limit){
                        self.offsetY = self.top_limit;
                    }else if (self.offsetY + deltaY<= self.bottom_limit) {
                        self.offsetY = self.bottom_limit;
                    }else
                        self.offsetY = self.offsetY + deltaY;

                    self.hmm_logo.refresh();
                }
                prevY=mouse.y;
            }
        });
        y_axis.addEventListener('dragstart', function(e) {
            prevY=null;
        });

        logo_canvas.addEventListener("mousemove",function(evt){
            var mouse = self.getMouse(evt),
                box = this.getBoundingClientRect(),
                offset = box.left + window.pageXOffset - document.documentElement.clientLeft,
                x = parseInt((evt.pageX - offset), 10),
                col = self.hmm_logo.columnFromCoordinates(x),
                track=self.get_track_from_y(mouse.y),
                refresh=false,
                clear=false;
            if (top< mouse.y && mouse.y<top+h){
                if (typeof self.active_sites_in_canvas[col] != "undefined" && typeof self.active_sites_in_canvas[col][track] != "undefined") {
                    var site = self.active_sites_in_canvas[col][track];
                    if (site.controller.over==-1) {
                        for (var i in self.active_sites_in_canvas)
                            for (var j in self.active_sites_in_canvas[i])
                                self.active_sites_in_canvas[i][j].controller.over=-1;
                        refresh=true;
                        site.controller.over=col;
                    }
                } else
                    clear = true;
            }else
                clear = true;
            if (clear)
                for (var i in self.active_sites_in_canvas)
                    for (var j in self.active_sites_in_canvas[i]) {
                        if (self.active_sites_in_canvas[i][j].controller.over!=-1)
                            refresh=true;
                        self.active_sites_in_canvas[i][j].controller.over = -1;
                    }
            if(refresh)
                self.hmm_logo.refresh();
        });
        logo_canvas.addEventListener("click",function(evt){
            for (var i in self.active_sites_in_canvas)
                for (var j in self.active_sites_in_canvas[i]) {
                    var controller = self.active_sites_in_canvas[i][j].controller;
                    if (controller.over != -1) {
                        var site_e = document.getElementById("active_site_info");
                        if (site_e!=null) site_e.innerHTML =
                            "<h2>Active Site Pattern</h2>" +
                            "<ul>" +
                            "   <li><b>Name:</b>"   + controller.name   + "</li>" +
                            "   <li><b>Source:</b>" + controller.source + "</li>" +
                            "   <li><b>Sites:</b>" + controller.getSitesHTML(controller.over) + "</li>" +
                            "   <li><b>Reported Proteins:</b>" + controller.getProteinsHTML(controller.over) + "</li>" +
                            "</ul>";
                    }
                }

        });
        this.bottom_limit = h - (Object.keys(self.data).length+0.5) * (this.feature_height +this.padding_between_tracks)
        this.addedEvents=true;
    };
    this.get_track_from_y = function(y){
        return Math.floor((y - self.offsetY - this.margin_to_features)/(this.padding_between_tracks + this.feature_height));
    };
    this.active_sites_in_canvas={};
    this.paint = function (context_num, start, end) {
        var second_axis = document.getElementById("second_y_axis");
        if (second_axis==null)
            second_axis = this.initialize_2nd_axis();
        this.canvas = second_axis;

        this._paint_2nd_axis(second_axis.getContext('2d'));

        this._paint_background(this.hmm_logo.contexts[context_num]);
        this.active_sites_in_canvas={};
        for (var i = start,x=0; i <= end; i++) {
            this._paint_column(context_num,i,x);
            x += this.hmm_logo.zoomed_column;
        }

        this.hmm_logo.paint_y_axis_label();

        if (!this.addedEvents)
            this.addEvents(second_axis,document.getElementsByClassName("logo_graphic")[0]);

    };

    this._paint_2nd_axis = function(context){
        context = context || self.context;
        self.context = context;
        context.clearRect(0, top, w, h);
       // var offset = (mode_button.mode==self.MODE_MULTIPLE)?0:w;

        draw_box(context, 0, top, w, h,
            "rgba(100,100,100, 0.2)","rgba(100,100,100, 0.0)"
        );
        for (var i=0;i<self.components.length;i++)
            self.components[i].draw(context);
    };
    this._paint_column = function(context_num,i,x) {
        var track =0;
        for (var j=0; j<this.data.length;j++) {
            track++;
            var wtd = this.data[j].controller.whatShouldBeDraw(i);
            if (wtd == null)
                continue;
            var color = this.hmm_logo.aa_colors[wtd.base],
                y1 = self.offsetY + this.margin_to_features + track * (this.padding_between_tracks + this.feature_height);

            if (top<y1 && y1<top+h-this.feature_height) {
                if (wtd.type == "BLOCK") {
                    if (typeof this.active_sites_in_canvas[i] == "undefined")
                        this.active_sites_in_canvas[i]={};
                    this.active_sites_in_canvas[i][track]=this.data[j];
                    draw_box(this.hmm_logo.contexts[context_num],
                        x + 1,
                        self.offsetY + this.margin_to_features + track * (this.padding_between_tracks + this.feature_height),
                        this.hmm_logo.zoomed_column - 2,
                        this.feature_height, color,
                        (this.data[j].controller.over==i)?"#000":"#AAA0AF");
                } else if (wtd.type == "LINE") {
                    draw_line(this.hmm_logo.contexts[context_num],
                        x,
                        self.offsetY + this.margin_to_features + this.padding_between_tracks * track + (track + 0.5) * this.feature_height,
                        x + this.hmm_logo.zoomed_column,
                        self.offsetY + this.margin_to_features + this.padding_between_tracks * track + (track + 0.5) * this.feature_height,
                        "#AAA0AF");
                }
            }
        }
    };
    this._paint_background = function(context){
        draw_box(context, 0, top-1, context.canvas.width, h,
            "rgba(100,100,100, 0.2)","rgba(100,100,100, 0.0)"
        );
    };
    this.paintLabels = function(context){
        draw_box(context, 0, top, context.canvas.width, h,
            "rgba(100,100,100, 0.2)","rgba(100,100,100, 0.0)"
        );
        context.fillStyle = "#666666";
        context.strokeStyle = "#666666";
        context.textAlign = "right";
        var track =0;
        for (var j=0; j<this.data.length;j++) {
            track++;
            var y1 = self.offsetY + this.margin_to_features + track * (this.padding_between_tracks + this.feature_height);
            if (top<y1 && y1<top+h-this.feature_height) {
                var y2 =self.offsetY + this.margin_to_features + this.padding_between_tracks * track + (track + 0.5) * this.feature_height;
                var fs = 12 - 4*Math.abs(1-(y2-top)/(h/2));
                context.font = "bold "+fs+"px Arial";
                context.fillText(
                    this.data[j].name,
                    53,
                    y2
                );
            }
        }
        context.font = "bold 10px Arial";
    };
    function draw_box(context, x, y, width, height, color,border) {
        color = color || "rgba(100,100,100, 0.2)";
        border = border || "rgba(100,100,100, 0.8)";
        context.fillStyle = color;
        context.strokeStyle = border;
        context.fillRect(x, y, width, height);
        context.strokeRect(x, y, width, height);
    }
    function draw_line(context, x1, y1, x2, y2, color) {
        color = color || "rgba(100,100,100, 0.8)";
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.lineWidth = 1;
        context.strokeStyle = color;
        context.stroke();
    }
    function draw_polygone(context,points,color) {
        context.fillStyle = color;
        context.strokeStyle = color;
        context.beginPath();
        context.moveTo(points[0][0],points[0][1]);
        for (var i=1;i<points.length;i++)
            context.lineTo(points[i][0],points[i][1]);
        context.fill();

    }
    function draw_circle(context,x,y,radius,color) {
        context.fillStyle = color;
        context.strokeStyle = color;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI*2, true);
        context.fill();
    }
};

function getAmountFromStyle(element,attribute){
    var value = parseInt(element.style[attribute]);
    return (isNaN(value))?0:value;
}

if (typeof module != "undefined")
    module.exports = ActiveSitesPanel;

},{"../components/canvas_button.js":4}],4:[function(require,module,exports){
/**
 * Created by gsalazar on 05/01/2016.
 */
"use strict";

var CanvasButton;

CanvasButton = function(options) {
    options = options || {};
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.w = options.w || 10;
    this.h = options.h || 10;
    this.color = options.color || "#000000";
    this.hover_color = options.hover_color || "#882222";

    this.STATE_NORMAL = 0;
    this.STATE_CLICKED = 1;
    this.STATE_MOUSE_OVER = 2

    var state = this.STATE_NORMAL;

    this.getState = function(){
        return state;
    };
    this.draw = function(context){
        context.fillStyle = ((state==this.STATE_NORMAL)?this.color:this.hover_color);
        context.fillRect(this.x, this.y, this.w, this.h);
    };

    this.mousemove = function(mouse){
        switch (state){
            case this.STATE_NORMAL:
                if (mouse.x>this.x && mouse.x<this.x+this.w && mouse.y>this.y && mouse.y<this.y+this.h)
                    state = this.STATE_MOUSE_OVER;
                break;
            case this.STATE_MOUSE_OVER:
                if (mouse.x<this.x || mouse.x>this.x+this.w || mouse.y<this.y || mouse.y>this.y+this.h)
                    state = this.STATE_NORMAL;
                break;
        }
    }
    this.click = function(mouse){
        if (state==this.STATE_MOUSE_OVER){
            this.onClick(mouse);
        }
    }
    this.onClick = function(mouse) {};
    this.onActionPerformed = function() {
        state = this.STATE_NORMAL;
    };
    this.onMouseOver = function(){
    }
    this.onMouseOut = function(){
        state = this.STATE_NORMAL;
    }
};

if (typeof module != "undefined")
    module.exports = CanvasButton
},{}],5:[function(require,module,exports){
// checking for canvas support and caching result
var canv_support = null;

function canvasSupport() {
    if (!canv_support) {
        var elem = document.createElement('canvas');
        canv_support = !!(elem.getContext && elem.getContext('2d'));
    }
    return canv_support;
}

if (typeof module != "undefined")
    module.exports = canvasSupport;
},{}],6:[function(require,module,exports){
function ConsensusColors() {

    this.grey = '#7a7a7a';

    function arbitrate(threshold, scoreref) {
        var bestclass = '.',
            bestscore   = 0,
            type        = null,
            a           = null,
            b           = null,
            classSize = {
                '.' : 20,
                'h' : 11,
                '+' : 3,
                '-' : 2,
                'o' : 2,
                'p' : 2
            };

        for (type in scoreref) {
            if (scoreref.hasOwnProperty(type)) {
                if (scoreref[type] >= threshold) {
                    a = classSize[type] || 1;
                    b = classSize[bestclass] || 1;

                    if (a < b) {
                        bestclass = type;
                        bestscore = scoreref[type];
                    } else if (a === b) {
                        if (scoreref[type] > bestscore) {
                            bestclass = type;
                            bestscore = scoreref[type];
                        }
                    }
                }
            }
        }
        return bestclass;
    }

    this.check_PG = function (pos, consensuses, colorsRef) {
        colorsRef[pos].P = '#ffff11';
        colorsRef[pos].G = '#ff7f11';
        return 1;
    };

    this.check_R = function (pos, consensuses, colorsRef) {
        colorsRef[pos].R = this.grey;

        var red = '#FF9999',
            letters = ['Q', 'K', 'R'],
            i = 0;

        for (i = 0; i < letters.length; i++) {
            if (consensuses['0.85'][pos] === letters[i]) {
                colorsRef[pos].R = red;
                return 1;
            }
        }

        if (consensuses['0.60'][pos] === '+' ||  consensuses['0.60'][pos] === 'R' || consensuses['0.60'][pos] === 'K') {
            colorsRef[pos].R = red;
            return 1;
        }
        return 1;
    };

    this.check_Q = function (pos, consensuses, colorsRef) {
        colorsRef[pos].Q = this.grey;

        var green = '#99FF99',
            letters = ['Q', 'T', 'K', 'R'],
            i = 0;

        if (consensuses['0.50'][pos] === 'b' ||
            consensuses['0.50'][pos] === 'E' ||
            consensuses['0.50'][pos] === 'Q') {
            colorsRef[pos].Q = green;
            return 1;
        }

        for (i = 0; i < letters.length; i++) {
            if (consensuses['0.85'][pos] === letters[i]) {
                colorsRef[pos].Q = green;
                return 1;
            }
        }

        if (consensuses['0.60'][pos] === '+' ||
            consensuses['0.60'][pos] === 'K' ||
            consensuses['0.50'][pos] === 'R') {
            colorsRef[pos].Q = green;
            return 1;
        }

        return 1;
    };

    this.check_N = function (pos, consensuses, colorsRef) {
        colorsRef[pos].N = this.grey;

        var green = '#99FF99';

        if (consensuses['0.50'][pos] === 'N') {
            colorsRef[pos].N = green;
            return 1;
        }

        if (consensuses['0.85'][pos] === 'D') {
            colorsRef[pos].N = green;
            return 1;
        }

        return 1;
    };

    this.check_K = function (pos, consensuses, colorsRef) {
        colorsRef[pos].K = this.grey;

        var red = '#FF9999',
            letters = ['K', 'R', 'Q'],
            i = 0;

        if (consensuses['0.60'][pos] === '+' ||
            consensuses['0.60'][pos] === 'R' ||
            consensuses['0.60'][pos] === 'K') {
            colorsRef[pos].K = red;
            return 1;
        }

        for (i = 0; i < letters.length; i++) {
            if (consensuses['0.85'][pos] === letters[i]) {
                colorsRef[pos].K = red;
                return 1;
            }
        }
        return 1;
    };

    this.check_E = function (pos, consensuses, colorsRef) {
        colorsRef[pos].E = this.grey;

        var red = '#FF9999',
            letters = ['D', 'E'],
            i = 0;

        if (consensuses['0.60'][pos] === '+' ||
            consensuses['0.60'][pos] === 'R' ||
            consensuses['0.60'][pos] === 'K') {
            colorsRef[pos].E = red;
            return 1;
        }

        for (i = 0; i < letters.length; i++) {
            if (consensuses['0.85'][pos] === letters[i]) {
                colorsRef[pos].E = red;
                return 1;
            }
        }

        if (consensuses['0.50'][pos] === 'b' ||
            consensuses['0.50'][pos] === 'E' ||
            consensuses['0.50'][pos] === 'Q') {
            colorsRef[pos].E = red;
            return 1;
        }

        return 1;
    };

    this.check_D = function (pos, consensuses, colorsRef) {
        colorsRef[pos].D = this.grey;

        var red = '#FF9999',
            letters = ['D', 'E', 'N'],
            i = 0;

        if (consensuses['0.60'][pos] === '+' ||
            consensuses['0.60'][pos] === 'R' ||
            consensuses['0.60'][pos] === 'K') {
            colorsRef[pos].D = red;
            return 1;
        }

        for (i = 0; i < letters.length; i++) {
            if (consensuses['0.85'][pos] === letters[i]) {
                colorsRef[pos].D = red;
                return 1;
            }
        }

        if (consensuses['0.50'][pos] === '-' ||
            consensuses['0.60'][pos] === 'E' ||
            consensuses['0.60'][pos] === 'D') {
            colorsRef[pos].D = red;
            return 1;
        }

        return 1;
    };

    this.check_ACFILMVW = function (pos, consensuses, colorsRef) {
        var aa = ['A', 'C', 'F', 'L', 'I', 'M', 'V', 'W'],
            caa = ['A', 'C', 'F', 'H', 'I', 'L', 'M', 'V', 'W', 'Y', 'P', 'Q', 'h'],
            i = 0,
            j = 0;

        for (i = 0; i < aa.length; i++) {
            colorsRef[pos][aa[i]] = this.grey;
            for (j = 0; j < caa.length; j++) {
                if (consensuses['0.60'][pos] === caa[j]) {
                    colorsRef[pos][aa[i]] = '#9999FF';
                }
            }
        }
        return 1;
    };

    this.check_ST = function (pos, consensuses, colorsRef) {
        colorsRef[pos].S = this.grey;
        colorsRef[pos].T = this.grey;

        var letters = ['A', 'C', 'F', 'H', 'I', 'L', 'M', 'V', 'W', 'Y', 'P', 'Q'],
            i = 0;

        if (consensuses['0.50'][pos] === 'a' ||
            consensuses['0.50'][pos] === 'S' ||
            consensuses['0.50'][pos] === 'T') {
            colorsRef[pos].S = '#99FF99';
            colorsRef[pos].T = '#99FF99';
            return 1;
        }

        for (i = 0; i < letters.length; i++) {
            if (consensuses['0.85'][pos] === letters[i]) {
                colorsRef[pos].S = '#99FF99';
                colorsRef[pos].T = '#99FF99';
                return 1;
            }
        }
    };

    this.check_HY = function (pos, consensuses, colorsRef) {
        colorsRef[pos].H = this.grey;
        colorsRef[pos].Y = this.grey;

        var letters = ['A', 'C', 'F', 'H', 'I', 'L', 'M', 'V', 'W', 'Y', 'P', 'Q', 'h'],
            i = 0,
            cyan = '#99FFFF';

        if (consensuses['0.60'][pos] === 'h') {
            colorsRef[pos].H = cyan;
            colorsRef[pos].Y = cyan;
            return 1;
        }

        for (i = 0; i < letters.length; i++) {
            if (consensuses[0.85][pos] === letters[i]) {
                colorsRef[pos].H = cyan;
                colorsRef[pos].Y = cyan;
                return 1;
            }
        }

        return 1;
    };

    this.color_map = function (probs_array) {
        var thresholds = ['0.50', '0.60', '0.80', '0.85'],
            hydro = {
                'W': 1,
                'L': 1,
                'V': 1,
                'I': 1,
                'M': 1,
                'A': 1,
                'F': 1,
                'C': 1,
                'Y': 1,
                'H': 1,
                'P': 1
            },
            polar = { 'Q': 1,  'N': 1},
            positive = { 'K': 1, 'R': 1, 'H': 1 },
            alcohol  = { 'S': 1, 'T': 1 },
            negative = { 'E': 1, 'D': 1 },
            cons = {},
            colors = [],
            i = 0,
            c = 0,
            t = 0,
            a = 0,
            aa = [],
            column = null,
            score = {},
            consensusCol = null,
            threshold = null;


        for (c = 0; c < probs_array.length; c++) {
            column = probs_array[c];
            for (t = 0; t < thresholds.length; t++) {
                threshold = thresholds[t];
                score = {
                    'p': 0,
                    'o': 0,
                    '-': 0,
                    '+': 0,
                    'h': 0
                };
                for (a = 0; a < column.length; a++) {
                    aa = [];
                    aa = column[a].split(':');
                    score[aa[0]] = parseFloat(aa[1], 10);
                    if (polar[aa[0]]) {
                        score.p = score.p + parseFloat(aa[1], 10);
                        continue;
                    }

                    if (alcohol[aa[0]]) {
                        score.o = score.o + parseFloat(aa[1], 10);
                        continue;
                    }

                    if (negative[aa[0]]) {
                        score['-'] = score['-'] + parseFloat(aa[1], 10);
                        continue;
                    }

                    if (positive[aa[0]]) {
                        score['+'] = score['+'] + parseFloat(aa[1], 10);
                    }

                    if (hydro[aa[0]]) {
                        score.h = score.h + parseFloat(aa[1], 10);
                    }
                }
                consensusCol = arbitrate(threshold, score);
                if (!cons[threshold]) {
                    cons[threshold] = [];
                }
                cons[threshold].push(consensusCol);
            }
        }

        for (i = 0; i < probs_array.length; i++) {
            colors[i] = {};
            this.check_D(i, cons, colors);
            this.check_R(i, cons, colors);
            this.check_Q(i, cons, colors);
            this.check_N(i, cons, colors);
            this.check_K(i, cons, colors);
            this.check_E(i, cons, colors);
            this.check_HY(i, cons, colors);
            this.check_ACFILMVW(i, cons, colors);
            //Colour alcohol.....
            this.check_ST(i, cons, colors);
            //Proline and Glycine get fixed colors....
            this.check_PG(i, cons, colors);
        }

        return colors;

    };
}

if (typeof module != "undefined")
    module.exports = ConsensusColors;
},{}],7:[function(require,module,exports){
if (typeof module != "undefined")
    var Letter = require("./letter.js"),
        canvasSupport   = require("./canvas_support.js"),
        ConsensusColors = require("./consensus_colors.js");


var feature_height = 10,
    margin_to_features = 10,
    padding_between_tracks=4;

function HMMLogo(options) {
    options = options || {};

    this.column_width = options.column_width || 34;
    this.height = options.height || 300;
    this.data = options.data || null;
    this.debug = options.debug || null;
    this.scale_height_enabled = options.height_toggle || null;
    if (options.zoom_buttons && options.zoom_buttons === 'disabled') {
        this.zoom_enabled = null;
    } else {
        this.zoom_enabled = true;
    }


    this.colorscheme = options.colorscheme || 'default';

    // never show the alignment coordinates by default as that would get
    // really confusing.
    this.display_ali_map = 0;

    this.alphabet = options.data.alphabet || 'dna';
    this.dom_element = options.dom_element || $('body');
    this.called_on = options.called_on || null;
    this.start = options.start || 1;
    this.end = options.end || this.data.height_arr.length;
    this.zoom = parseFloat(options.zoom) || 0.4;
    this.default_zoom = this.zoom;

    this.active_sites_sources = options.active_sites_sources || null;
    this.show_active_sites = false;
    this.active_sites_adder = null;

    // turn off the insert rows if the hmm used the observed or weighted processing flags.
    if (this.data.processing && /^observed|weighted/.test(this.data.processing)) {
        this.show_inserts = 0;
        this.info_content_height = 286;
    } else {
        this.show_inserts = 1;
        this.info_content_height = 256;
    }
    this.column_hover = -1;
    this.column_clicked = -1;


    if (options.scaled_max) {
        this.data.max_height = options.data.max_height_obs || this.data.max_height || 2;
    } else {
        this.data.max_height = options.data.max_height_theory || this.data.max_height || 2;
    }


    this.dna_colors = {
        'A': '#cbf751',
        'C': '#5ec0cc',
        'G': '#ffdf59',
        'T': '#b51f16',
        'U': '#b51f16'
    };

    this.aa_colors = {
        'A': '#FF9966',
        'C': '#009999',
        'D': '#FF0000',
        'E': '#CC0033',
        'F': '#00FF00',
        'G': '#f2f20c',
        'H': '#660033',
        'I': '#CC9933',
        'K': '#663300',
        'L': '#FF9933',
        'M': '#CC99CC',
        'N': '#336666',
        'P': '#0099FF',
        'Q': '#6666CC',
        'R': '#990000',
        'S': '#0000FF',
        'T': '#00FFFF',
        'V': '#FFCC33',
        'W': '#66CC66',
        'Y': '#006600'
    };

    // set the color library to use.
    this.colors = this.dna_colors;

    if (this.alphabet === 'aa') {
        this.colors = this.aa_colors;
    }

    this.canvas_width = 1000;

    var letter = null,
        probs_arr = null,
        loptions = null,
        cc = null;

    if (this.alphabet === 'aa') {
        probs_arr = this.data.probs_arr;
        if (probs_arr) {
            cc = new ConsensusColors();
            this.cmap = cc.color_map(probs_arr);
        }
    }

    //build the letter canvases
    this.letters = {};

    for (letter in this.colors) {
        if (this.colors.hasOwnProperty(letter)) {
            loptions = {color: this.colors[letter]};
            this.letters[letter] = new Letter(letter, loptions);
        }
    }

    // this needs to be set to null here so that we can initialise it after
    // the render function has fired and the width determined.
    this.scrollme = null;

    this.previous_target = 0;
    // keeps track of which canvas elements have been drawn and which ones haven't.
    this.rendered = [];
    this.previous_zoom = 0;

    function draw_box(context, x, y, width, height, color,border) {
        color = color || "rgba(100,100,100, 0.2)";
        border = border || "rgba(100,100,100, 0.8)";
        context.fillStyle = color;
        context.strokeStyle = border;
        context.fillRect(x, y, width, height);
        context.strokeRect(x, y, width, height);
    }
    function draw_small_insert(context, x, y, col_width, in_odds, in_length, del_odds, show_inserts) {
        var fill = "#ffffff";
        if (show_inserts) {
            if (in_odds > 0.1) {
                fill = '#d7301f';
            } else if (in_odds > 0.05) {
                fill = '#fc8d59';
            } else if (in_odds > 0.03) {
                fill = '#fdcc8a';
            }
            context.fillStyle = fill;
            context.fillRect(x, y + 15, col_width, 10);

            fill = "#ffffff";
            // draw insert length
            if (in_length > 9) {
                fill = '#d7301f';
            } else if (in_length > 7) {
                fill = '#fc8d59';
            } else if (in_length > 4) {
                fill = '#fdcc8a';
            }
            context.fillStyle = fill;
            context.fillRect(x, y + 30, col_width, 10);
        } else {
            y  = y + 30;
        }

        fill = "#ffffff";
        // draw delete odds
        if (del_odds < 0.75) {
            fill = '#2171b5';
        } else if (del_odds < 0.85) {
            fill = '#6baed6';
        } else if (del_odds < 0.95) {
            fill = '#bdd7e7';
        }
        context.fillStyle = fill;
        context.fillRect(x, y, col_width, 10);
    }

    function draw_border(context, y, width) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.lineWidth = 1;
        context.strokeStyle = "#999999";
        context.stroke();
    }

    function draw_ticks(context, x, y, height, color) {
        color = color || '#999999';
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x, y + height);
        context.lineWidth = 1;
        context.strokeStyle = color;
        context.stroke();
    }

    function draw_rect_with_text(context, x, y, text, fontsize, col_width, fill, textfill) {
        context.font = fontsize + "px Arial";
        context.fillStyle = fill;
        context.fillRect(x, y - 10, col_width, 14);
        context.textAlign = "center";
        context.fillStyle = textfill;
        context.fillText(text, x + (col_width / 2), y);
    }

    function draw_insert_odds(context, x, height, col_width, text, fontsize) {
        var y        = height - 20,
            fill     = '#ffffff',
            textfill = '#555555';

        if (text > 0.1) {
            fill     = '#d7301f';
            textfill = '#ffffff';
        } else if (text > 0.05) {
            fill = '#fc8d59';
        } else if (text > 0.03) {
            fill = '#fdcc8a';
        }

        draw_rect_with_text(context, x, y, text, fontsize, col_width, fill, textfill);

        //draw vertical line to indicate where the insert would occur
        if (text > 0.03) {
            draw_ticks(context, x + col_width, height - 30, -30 - height, fill);
        }
    }

    function draw_insert_length(context, x, y, col_width, text, fontsize) {
        var fill = '#ffffff',
            textfill = '#555555';

        if (text > 9) {
            fill     = '#d7301f';
            textfill = '#ffffff';
        } else if (text > 7) {
            fill = '#fc8d59';
        } else if (text > 4) {
            fill = '#fdcc8a';
        }
        draw_rect_with_text(context, x, y, text, fontsize, col_width, fill, textfill);
    }

    function draw_delete_odds(context, x, height, col_width, text, fontsize, show_inserts) {
        var y        = height - 4,
            fill     = '#ffffff',
            textfill = '#555555';

        if (show_inserts) {
            y = height - 35;
        }

        if (text < 0.75) {
            fill     = '#2171b5';
            textfill = '#ffffff';
        } else if (text < 0.85) {
            fill = '#6baed6';
        } else if (text < 0.95) {
            fill = '#bdd7e7';
        }

        draw_rect_with_text(context, x, y, text, fontsize, col_width, fill, textfill);
    }


    function draw_column_number(context, x, y, col_width, col_num, fontsize, right) {
        context.font = fontsize + "px Arial";
        context.textAlign = right ? "right" : "center";
        context.fillStyle = "#666666";
        context.fillText(col_num, x + (col_width / 2), y);
    }


    function attach_canvas(DOMid, height, width, id, canv_width) {
        var canvas = $(DOMid).find('#canv_' + id);

        if (!canvas.length) {
            $(DOMid).append('<canvas class="canvas_logo" id="canv_' + id + '"  height="' + height + '" width="' + width + '" style="left:' + canv_width * id + 'px"></canvas>');
            canvas = $(DOMid).find('#canv_' + id);
        }

        $(canvas).attr('width', width).attr('height', height);

        if (!canvasSupport()) {
            canvas[0] = G_vmlCanvasManager.initElement(canvas[0]);
        }

        return canvas[0];
    }

    // the main render function that draws the logo based on the provided options.
    this.render = function (options) {
        if (!this.data) {
            return;
        }
        options    = options || {};
        var zoom   = options.zoom || this.zoom,
            target = options.target || 1,
            scaled = options.scaled || null,
            parent_width = $(this.dom_element).parent().width(),
            max_canvas_width = 1,
            end = null,
            start = null,
            i = 0;

        if (target === this.previous_target) {
            return;
        }

        this.previous_target = target;


        if (options.start) {
            this.start = options.start;
        }
        if (options.end) {
            this.end = options.end;
        }

        if (zoom <= 0.1) {
            zoom = 0.1;
        } else if (zoom >= 1) {
            zoom = 1;
        }

        this.zoom = zoom;

        end = this.end || this.data.height_arr.length;
        start = this.start || 1;
        end     = (end > this.data.height_arr.length) ? this.data.height_arr.length : end;
        end     = (end < start) ? start : end;

        start     = (start > end) ? end : start;
        start     = (start > 1) ? start : 1;

        this.y = this.height - 20;
        // Check to see if the logo will fit on the screen at full zoom.
        this.max_width = this.column_width * ((end - start) + 1);
        // If it fits then zoom out and disable zooming.
        if (parent_width > this.max_width) {
            zoom = 1;
            this.zoom_enabled = false;
        }
        this.zoom = zoom;

        this.zoomed_column = this.column_width * zoom;
        this.total_width = this.zoomed_column * ((end - start) + 1);

        // If zoom is not maxed and we still aren't filling the window
        // then ramp up the zoom level until it fits, then disable zooming.
        // Then we get a decent logo with out needing to zoom in or out.
        if (zoom < 1) {
            while (this.total_width < parent_width) {
                this.zoom += 0.1;
                this.zoomed_column = this.column_width * this.zoom;
                this.total_width = this.zoomed_column * ((end - start) + 1);
                this.zoom_enabled = false;
                if (zoom >= 1) {
                    break;
                }
            }
        }

        if (target > this.total_width) {
            target = this.total_width;
        }
        $(this.dom_element).attr({'width': this.total_width + 'px'}).css({width: this.total_width + 'px'});

        var canvas_count = Math.ceil(this.total_width / this.canvas_width);
        this.columns_per_canvas = Math.ceil(this.canvas_width / this.zoomed_column);


        if (this.previous_zoom !== this.zoom) {
            $(this.dom_element).find('canvas').remove();
            this.previous_zoom = this.zoom;
            this.rendered = [];
        }

        this.canvases = [];
        this.contexts = [];


        for (i = 0; i < canvas_count; i++) {

            var split_start = (this.columns_per_canvas * i) + start,
                split_end   = split_start + this.columns_per_canvas - 1;
            if (split_end > end) {
                split_end = end;
            }

            var adjusted_width = ((split_end - split_start) + 1) * this.zoomed_column;

            if (adjusted_width > max_canvas_width) {
                max_canvas_width = adjusted_width;
            }

            var canv_start = max_canvas_width * i,
                canv_end = canv_start + adjusted_width;

            if (target < canv_end + (canv_end / 2) && target > canv_start - (canv_start / 2)) {
                // Check that we aren't redrawing the canvas and if not, then attach it and draw.
                if (this.rendered[i] !== 1) {

                    this.canvases[i] = attach_canvas(this.dom_element, this.height, adjusted_width, i, max_canvas_width);
                    this.contexts[i] = this.canvases[i].getContext('2d');
                    this.contexts[i].setTransform(1, 0, 0, 1, 0, 0);
                    this.contexts[i].clearRect(0, 0, adjusted_width, this.height);
                    this.contexts[i].fillStyle = "#ffffff";
                    this.contexts[i].fillRect(0, 0, canv_end, this.height);


                    if (this.zoomed_column > 12) {
                        var fontsize = parseInt(10 * zoom, 10);
                        fontsize = (fontsize > 10) ? 10 : fontsize;
                        if (this.debug) {
                            this.render_with_rects(split_start, split_end, i, 1);
                        }
                        this.render_with_text(split_start, split_end, i, fontsize);
                    } else {
                        this.render_with_rects(split_start, split_end, i);
                    }
                    if (this.show_active_sites && this.active_sites_adder!=null) {
                        this.active_sites_adder.setDrawingOptions({
                            margin_to_features: margin_to_features,
                            padding_between_tracks: padding_between_tracks,
                            feature_height: feature_height
                        });
                        this.active_sites_adder.panel.paint(i, split_start, split_end);
                    }
                    this.rendered[i] = 1;

                }
            }

        }

        // check if the scroller object has been initialised and if not then do so.
        // we do this here as opposed to at object creation, because we need to
        // make sure the logo has been rendered and the width is correct, otherwise
        // we get a weird initial state where the canvas will bounce back to the
        // beginning the first time it is scrolled, because it thinks it has a
        // width of 0.
        if (!this.scrollme) {
            if (canvasSupport()) {
                this.scrollme = new EasyScroller($(this.dom_element)[0], {
                    scrollingX: 1,
                    scrollingY: 0,
                    eventTarget: this.called_on
                });
            }
        }

        if (target !== 1 && canvasSupport()) {
            this.scrollme.reflow();
        }
        return;
    };

    this.render_x_axis_label = function () {
        var label = "Model Position";
        if (this.display_ali_map) {
            label = "Alignment Column";
        }
        $(this.called_on).find('.logo_xaxis').remove();
        $(this.called_on).prepend('<div class="logo_xaxis" class="centered" style="margin-left:40px"><p class="xaxis_text" style="width:10em;margin:1em auto">' + label + '</p></div>');
    };

    this.render_y_axis_label = function () {
        //attach a canvas for the y-axis
        $(this.dom_element).parent().before('<canvas class="logo_yaxis" height="302" width="55" draggable="true"></canvas>');
        this.paint_y_axis_label();
    };

    this.paint_y_axis_label = function () {
        var canvas = $(this.called_on).find('.logo_yaxis'),
            context,
            moveTitle=0;
        if (!canvasSupport()) {
            canvas[0] = G_vmlCanvasManager.initElement(canvas[0]);
        }
        context = canvas[0].getContext('2d');

        var axis_label = "Information Content (bits)";
        context.clearRect(0, 0, 55, 300);


        //draw min/max tick marks
        context.beginPath();
        context.moveTo(55, 1);
        context.lineTo(40, 1);

        context.moveTo(55, this.info_content_height);
        context.lineTo(40, this.info_content_height);


        context.moveTo(55, (this.info_content_height / 2));
        context.lineTo(40, (this.info_content_height / 2));
        context.lineWidth = 1;
        context.strokeStyle = "#666666";
        context.stroke();

        //draw the label text
        context.fillStyle = "#666666";
        context.textAlign = "right";
        context.font = "bold 10px Arial";

        // draw the max label
        context.textBaseline = "top";
        context.fillText(parseFloat(this.data.max_height).toFixed(1), 38, 0);
        context.textBaseline = "middle";

        // draw the midpoint labels
        context.fillText(parseFloat(this.data.max_height / 2).toFixed(1), 38, (this.info_content_height / 2));
        // draw the min label
        context.fillText('0', 38, this.info_content_height);

        if (this.show_active_sites && this.active_sites_adder!=null) {
            this.active_sites_adder.panel.paintLabels(context);
            moveTitle=40;
        }

        // draw the axis label
        if (this.data.height_calc === 'score') {
            axis_label = "Score (bits)";
        }

        context.save();
        context.translate(5, this.height / 2 - 20 + moveTitle);
        context.rotate(-Math.PI / 2);
        context.textAlign = "center";
        context.font = "normal 12px Arial";
        context.fillText(axis_label, 1, 0);
        context.restore();

        // draw the insert row labels
        context.fillText('occupancy', 55, this.info_content_height + 7);
        if (this.show_inserts) {
            context.fillText('ins. prob.', 50, 280);
            context.fillText('ins. len.', 46, 296);
        }

    };

    this.render_2nd_y_axis_label = function () {
        //attach a canvas for the y-axis
        $(this.dom_element).parent().after('<canvas id ="second_y_axis" class="second_yaxis" height="302" width="55" draggable="true"></canvas>');
        var canvas = $(this.called_on).find('.second_yaxis'),
            top_pix_height = 0,
            bottom_pix_height = 0,
            top_height = Math.abs(this.data.max_height),
            bottom_height = (isNaN(this.data.min_height_obs)) ? 0 : parseInt(this.data.min_height_obs, 10),
            context = null,
            axis_label = "Information Content (bits)";
        if (!canvasSupport()) {
            canvas[0] = G_vmlCanvasManager.initElement(canvas[0]);
        }

        return canvas[0];
    };

    this.render_with_text = function (start, end, context_num, fontsize) {
        var x = 0,
            column_num = start,
            column_label = null,
            i = 0,
            top_height = Math.abs(this.data.max_height),
            bottom_height = (isNaN(this.data.min_height_obs)) ? 0 : parseInt(this.data.min_height_obs, 10),
            total_height = top_height + Math.abs(bottom_height),
            top_percentage    = Math.round((Math.abs(this.data.max_height) * 100) / total_height),
        //convert % to pixels
            top_pix_height = Math.round((this.info_content_height * top_percentage) / 100),
            bottom_pix_height = this.info_content_height - top_pix_height,
        // this is used to transform the 256px high letters into the correct size
        // when displaying negative values, so that they fit above the 0 line.
            top_pix_conversion = top_pix_height / this.info_content_height,
            bottom_pix_conversion = bottom_pix_height / this.info_content_height;

        // add 3 extra columns so that numbers don't get clipped at the end of a canvas
        // that ends before a large column. DF0000830 was suffering at zoom level 0.6,
        // column 2215. This adds a little extra overhead, but is the easiest fix for now.
        if (end + 3 <= this.end) {
            end += 3;
        }

        for (i = start; i <= end; i++) {
            if (this.data.mmline && this.data.mmline[i - 1] === 1) {
                this.contexts[context_num].fillStyle = '#cccccc';
                this.contexts[context_num].fillRect(x, 10, this.zoomed_column, this.height - 40);
            } else {
                var column = this.data.height_arr[i - 1],
                    col_positions = [];
                if (column) {
                    var previous_height = 0,
                        letters = column.length,
                        previous_neg_height = top_pix_height,
                        j = 0,
                        color = null;
                    if (i==this.column_clicked){
                        this.contexts[context_num].fillStyle = '#ffdede';
                        this.contexts[context_num].fillRect(x, 0, this.zoomed_column, this.height);
                        this.contexts[context_num].strokeStyle = '#ff8888';
                        this.contexts[context_num].strokeRect(x, 0, this.zoomed_column, this.height);
                    }
                    if (i==this.column_hover){
                        this.contexts[context_num].fillStyle = '#ffeeee';
                        this.contexts[context_num].fillRect(x, 0, this.zoomed_column, this.height);
                    }

                    for (j = 0; j < letters; j++) {
                        var letter = column[j],
                            values = letter.split(':', 2),
                            x_pos = x + (this.zoomed_column / 2),
                            letter_height = null;

                        // we don't render anything with a value between 0 and 0.01. These
                        // letters would be too small to be meaningful on any scale, so we
                        // just squash them out.
                        if (values[1] > 0.01) {
                            letter_height = parseFloat(values[1]) / this.data.max_height;
                            var y_pos = (this.info_content_height - 2) - previous_height,
                                glyph_height = (this.info_content_height - 2) * letter_height;

                            // The positioning in IE is off, so we need to modify the y_pos when
                            // canvas is not supported and we are using VML instead.
                            if (!canvasSupport()) {
                                y_pos = y_pos + (glyph_height * (letter_height / 2));
                            }

                            col_positions[j] = [glyph_height, this.zoomed_column, x_pos, y_pos];
                            previous_height = previous_height + glyph_height;
                        }
                    }

                    // render the letters in reverse order so that the larger letters on the top
                    // don't clobber the smaller letters below them.
                    for (j = letters; j >= 0; j--) {
                        if (col_positions[j] && this.letters[column[j][0]]) {
                            if (this.colorscheme === 'consensus') {
                                color = this.cmap[i - 1][column[j][0]] || "#7a7a7a";
                            } else {
                                color = null;
                            }
                            this.letters[column[j][0]].draw(this.contexts[context_num], col_positions[j][0], col_positions[j][1], col_positions[j][2], col_positions[j][3], color);
                        }
                    }
                }
            }


            // if ali_coordinates exist and toggle is set then display the
            // alignment coordinates and not the model coordinates.
            if (this.display_ali_map) {
                column_label = this.data.ali_map[i - 1];
            } else {
                column_label = column_num;
            }

            if (this.zoom < 0.7) {
                if (i % 5 === 0) {
                    this.draw_column_divider({
                        context_num : context_num,
                        x : x,
                        fontsize: 10,
                        column_num: column_label,
                        ralign: true
                    });
                }
            } else {
                this.draw_column_divider({
                    context_num : context_num,
                    x : x,
                    fontsize: fontsize,
                    column_num: column_label
                });
            }

            draw_delete_odds(this.contexts[context_num], x, this.height, this.zoomed_column, this.data.delete_probs[i - 1], fontsize, this.show_inserts);
            //draw insert length ticks
            draw_ticks(this.contexts[context_num], x, this.height - 15, 5);
            if (this.show_inserts) {
                draw_insert_odds(this.contexts[context_num], x, this.height, this.zoomed_column, this.data.insert_probs[i - 1], fontsize);
                draw_insert_length(this.contexts[context_num], x, this.height - 5, this.zoomed_column, this.data.insert_lengths[i - 1], fontsize);

                // draw delete probability ticks
                draw_ticks(this.contexts[context_num], x, this.height - 45, 5);
                // draw insert probability ticks
                draw_ticks(this.contexts[context_num], x, this.height - 30, 5);
            }


            x += this.zoomed_column;
            column_num++;

        }

        // draw other dividers
        if (this.show_inserts) {
            draw_border(this.contexts[context_num], this.height - 30, this.total_width);
            draw_border(this.contexts[context_num], this.height - 45, this.total_width);
        }
        draw_border(this.contexts[context_num], this.height - 15, this.total_width);
        draw_border(this.contexts[context_num], 0, this.total_width);
    };

    this.draw_column_divider = function (opts) {
        var div_x = opts.ralign ? opts.x + this.zoomed_column : opts.x,
            num_x = opts.ralign ? opts.x + 2 : opts.x;
        // draw column dividers
        draw_ticks(this.contexts[opts.context_num], div_x, this.height - 30, -30 - this.height, '#dddddd');
        // draw top ticks
        draw_ticks(this.contexts[opts.context_num], div_x, 0, 5);
        // draw column numbers
        draw_column_number(this.contexts[opts.context_num], num_x, 10, this.zoomed_column, opts.column_num, opts.fontsize, opts.ralign);
    };

    this.render_with_rects = function (start, end, context_num, borders) {
        var x = 0,
            column_num = start,
            column_label = null,
            i = 0,
            top_height = Math.abs(this.data.max_height),
            bottom_height = Math.abs(this.data.min_height_obs),
            total_height = top_height + bottom_height,
            top_percentage    = Math.round((Math.abs(this.data.max_height) * 100) / total_height),
        //convert % to pixels
            top_pix_height = Math.round((this.info_content_height * top_percentage) / 100),
            bottom_pix_height = this.info_content_height - top_pix_height,
            mod = 10;

        for (i = start; i <= end; i++) {
            if (this.data.mmline && this.data.mmline[i - 1] === 1) {
                this.contexts[context_num].fillStyle = '#cccccc';
                this.contexts[context_num].fillRect(x, 10, this.zoomed_column, this.height - 40);
            } else {
                var column = this.data.height_arr[i - 1],
                    previous_height = 0,
                    previous_neg_height = top_pix_height,
                    letters = column.length,
                    j = 0;
                for (j = 0; j < letters; j++) {
                    var letter = column[j],
                        values = letter.split(':', 2);
                    if (values[1] > 0.01) {
                        var letter_height = parseFloat(values[1]) / this.data.max_height,
                            x_pos = x,
                            glyph_height = (this.info_content_height - 2) * letter_height,
                            y_pos = (this.info_content_height - 2) - previous_height - glyph_height,
                            color = null;

                        if(this.colorscheme === 'consensus') {
                            color = this.cmap[i - 1][values[0]] || "#7a7a7a";
                        } else {
                            color = this.colors[values[0]];
                        }

                        if (borders) {
                            this.contexts[context_num].strokeStyle = color;
                            this.contexts[context_num].strokeRect(x_pos, y_pos, this.zoomed_column, glyph_height);
                        } else {
                            this.contexts[context_num].fillStyle = color;
                            this.contexts[context_num].fillRect(x_pos, y_pos, this.zoomed_column, glyph_height);
                        }

                        previous_height = previous_height + glyph_height;
                    }
                }
            }


            if (this.zoom < 0.2) {
                mod = 20;
            } else if (this.zoom < 0.3) {
                mod = 10;
            }

            if (i % mod === 0) {
                // draw column dividers
                draw_ticks(this.contexts[context_num], x + this.zoomed_column, this.height - 30, parseFloat(this.height), '#dddddd');
                // draw top ticks
                draw_ticks(this.contexts[context_num], x + this.zoomed_column, 0, 5);

                // if ali_coordinates exist and toggle is set then display the
                // alignment coordinates and not the model coordinates.
                if (this.display_ali_map) {
                    column_label = this.data.ali_map[i - 1];
                } else {
                    column_label = column_num;
                }
                // draw column numbers
                draw_column_number(this.contexts[context_num], x - 2,  10, this.zoomed_column, column_label, 10, true);
            }


            // draw insert probabilities/lengths
            draw_small_insert(
                this.contexts[context_num],
                x,
                this.height - 42,
                this.zoomed_column,
                this.data.insert_probs[i - 1],
                this.data.insert_lengths[i - 1],
                this.data.delete_probs[i - 1],
                this.show_inserts
            );

            // draw other dividers
            if (this.show_inserts) {
                draw_border(this.contexts[context_num], this.height - 45, this.total_width);
            } else {
                draw_border(this.contexts[context_num], this.height - 15, this.total_width);
            }

            draw_border(this.contexts[context_num], 0, this.total_width);

            x += this.zoomed_column;
            column_num++;
        }

    };

    this.toggle_colorscheme = function (scheme) {
        // work out the current column we are on so we can return there
        var col_total = this.current_column();

        if (scheme) {
            if (scheme === 'default') {
                this.colorscheme = 'default';
            } else {
                this.colorscheme = 'consensus';
            }
        } else {
            if (this.colorscheme === 'default') {
                this.colorscheme = 'consensus';
            } else {
                this.colorscheme = 'default';
            }
        }

        this.refresh();

    };

    this.toggle_scale = function (scale) {
        // work out the current column we are on so we can return there
        var col_total = this.current_column();

        if (scale) {
            if (scale === 'obs') {
                this.data.max_height = this.data.max_height_obs;
            } else {
                this.data.max_height = this.data.max_height_theory;
            }
        } else {
            // toggle the max height
            if (this.data.max_height === this.data.max_height_obs) {
                this.data.max_height = this.data.max_height_theory;
            } else {
                this.data.max_height = this.data.max_height_obs;
            }
        }
        //update the y-axis
        $(this.called_on).find('.logo_yaxis').remove();
        this.render_y_axis_label();

        this.refresh();
    };

    this.toggle_ali_map = function (coords) {
        // work out the current column we are on so we can return there
        var col_total = this.current_column();

        if (coords) {
            if (coords === 'model') {
                this.display_ali_map = 0;
            } else {
                this.display_ali_map = 1;
            }
        } else {
            // toggle the max height
            if (this.display_ali_map === 1) {
                this.display_ali_map = 0;
            } else {
                this.display_ali_map = 1;
            }
        }
        this.render_x_axis_label();

        this.refresh();

    };

    this.current_column = function () {
        var before_left = this.scrollme.scroller.getValues().left,
            col_width = (this.column_width * this.zoom),
            col_count = before_left / col_width,
            half_visible_columns = ($(this.called_on).find('.logo_container').width() / col_width) / 2,
            col_total = Math.ceil(col_count + half_visible_columns);
        return col_total;
    };

    this.change_zoom = function (options) {
        var zoom_level = 0.3,
            expected_width = null;
        if (options.target) {
            zoom_level = options.target;
        } else if (options.distance) {
            zoom_level = (parseFloat(this.zoom) - parseFloat(options.distance)).toFixed(1);
            if (options.direction === '+') {
                zoom_level = (parseFloat(this.zoom) + parseFloat(options.distance)).toFixed(1);
            }
        }

        if (zoom_level > 1) {
            zoom_level = 1;
        } else if (zoom_level < 0.1) {
            zoom_level = 0.1;
        }

        // see if we need to zoom or not
        expected_width = ($(this.called_on).find('.logo_graphic').width() * zoom_level) / this.zoom;
        if (expected_width > $(this.called_on).find('.logo_container').width()) {
            // if a center is not specified, then use the current center of the view
            if (!options.column) {
                //work out my current position
                var col_total = this.current_column();

                this.zoom = zoom_level;
                this.render({zoom: this.zoom});
                this.scrollme.reflow();

                //scroll to previous position
                this.scrollToColumn(col_total);
            } else { // center around the mouse click position.
                this.zoom = zoom_level;
                this.render({zoom: this.zoom});
                this.scrollme.reflow();

                var coords = this.coordinatesFromColumn(options.column);
                this.scrollme.scroller.scrollTo(coords - options.offset);
            }
        }
        return this.zoom;
    };

    this.columnFromCoordinates = function (x) {
        var column = Math.ceil(x / (this.column_width * this.zoom));
        return column;
    };

    this.coordinatesFromColumn = function (col) {
        var new_column = col - 1,
            x = (new_column  * (this.column_width * this.zoom)) + ((this.column_width * this.zoom) / 2);
        return x;
    };

    this.scrollToColumn = function (num, animate) {
        var half_view = ($(this.called_on).find('.logo_container').width() / 2),
            new_left = this.coordinatesFromColumn(num);
        this.scrollme.scroller.scrollTo(new_left - half_view, 0, animate);
    };
    this.refresh = function(){
        this.rendered = [];
        this.scrollme.reflow();
        this.scrollToColumn(this.current_column()+1);
        this.scrollToColumn(this.current_column()-1);
    };

}

if (typeof module != "undefined")
    module.exports = HMMLogo;
},{"./canvas_support.js":5,"./consensus_colors.js":6,"./letter.js":8}],8:[function(require,module,exports){
function Letter(letter, options) {
    options = options || {};
    this.value = letter;
    this.width = parseInt(options.width, 10) || 100;

    //W is 30% wider than the other letters, so need to make sure
    //it gets modified accordingly.
    if (this.value === 'W') {
        this.width += (this.width * 30) / 100;
    }

    this.height = parseInt(options.height, 10) || 100;

    this.color = options.color || '#000000';
    // if the height and width are changed from the default, then
    // this will also need to be changed as it cant be calculated
    // dynamically.
    this.fontSize = options.fontSize || 138;

    this.scaled = function () { };

    this.draw = function (ext_ctx, target_height, target_width, x, y, color) {
        var h_ratio = target_height / this.height,
            w_ratio = target_width / this.width,
            prev_font = ext_ctx.font;
        ext_ctx.transform(w_ratio, 0, 0, h_ratio, x, y);
        ext_ctx.fillStyle = color || this.color;
        ext_ctx.textAlign = "center";
        ext_ctx.font = "bold " + this.fontSize + "px Arial";

        ext_ctx.fillText(this.value, 0, 0);
        //restore the canvas settings
        ext_ctx.setTransform(1, 0, 0, 1, 0, 0);
        ext_ctx.fillStyle = '#000000';
        ext_ctx.font = prev_font;
    };

}

if (typeof module != "undefined")
    module.exports = Letter;
},{}],9:[function(require,module,exports){
/*jslint browser:true */
/*global G_vmlCanvasManager, EasyScroller */
/** @license
 * HMM logo
 * https://github.com/Janelia-Farm-Xfam/hmm_logo_js
 * Copyright 2013, Jody Clements.
 * Licensed under the MIT License.
 * https://github.com/Janelia-Farm-Xfam/hmm_logo_js/blob/master/LICENSE.txt
 */
if (typeof module != "undefined")
  var canvasSupport = require("./components/canvas_support.js"),
      HMMLogo = require("./components/hmm_logo_canvas"),
      ActiveSitesAdder = require("./ActiveSites/ActiveSitesAdder.js");

(function ($) {
  "use strict";

  $.fn.hmm_logo = function (options) {
    var logo = null,
      logo_graphic = $('<div class="logo_graphic">');
    var self = this;
    if (canvasSupport()) {
      options = options || {};

      // add some internal divs for scrolling etc.
      $(this).append(
        $('<div class="logo_container">').append(logo_graphic).append('<div class="logo_divider">')
      );

      options.data = $(this).data('logo');

      if (options.data === null) {
        return;
      }

      options.dom_element = logo_graphic;
      options.called_on = this;

      var zoom = options.zoom || 0.4,
        form = $('<form class="logo_form"><fieldset><label for="position">Column number</label>' +
          '<input type="text" name="position" class="logo_position" />' +
          '<button class="button logo_change">Go</button></fieldset>' +
          '</form>'),
        controls = $('<div class="logo_controls">'),
        settings = $('<div class="logo_settings">');

      settings.append('<span class="close">x</span>');

      logo = new HMMLogo(options);
      logo.render_x_axis_label();
      logo.render_y_axis_label();
      logo.render(options);

      if (logo.zoom_enabled) {
        controls.append('<button class="logo_zoomout button">-</button>' +
          '<button class="logo_zoomin button">+</button>');
      }

      /* we don't want to toggle if the max height_obs is greater than max theoretical
       * as letters will fall off the top.
       */
      if (logo.scale_height_enabled && (logo.data.max_height_obs < logo.data.max_height_theory)) {
        var obs_checked = '',
          theory_checked = '',
          theory_help = '',
          obs_help = '';

        if (logo.data.max_height_obs === logo.data.max_height) {
          obs_checked = 'checked';
        } else {
          theory_checked = 'checked';
        }

        if (options.help) {
          obs_help = '<a class="help" href="/help#scale_obs" title="Set the y-axis maximum to the maximum observed height.">' +
            '<span aria-hidden="true" data-icon="?"></span><span class="reader-text">help</span></a>';
          theory_help = '<a class="help" href="/help#scale_theory" title="Set the y-axis maximum to the theoretical maximum height">' +
            '<span aria-hidden="true" data-icon="?"></span><span class="reader-text">help</span></a>';
        }

        var scale_controls = '<fieldset><legend>Scale</legend>' +
          '<label><input type="radio" name="scale" class="logo_scale" value="obs" ' + obs_checked +
          '/>Maximum Observed ' + obs_help +
          '</label></br>' +
          '<label><input type="radio" name="scale" class="logo_scale" value="theory" ' + theory_checked +
          '/>Maximum Theoretical ' + theory_help +
          '</label>' +
          '</fieldset>';

        settings.append(scale_controls);
      }

      if (logo.data.height_calc !== 'score' && logo.data.alphabet === 'aa' && logo.data.probs_arr) {

        var def_color = null,
          con_color = null,
          def_help = '',
          con_help = '';

        if (logo.colorscheme === 'default') {
          def_color = 'checked';
        } else {
          con_color = 'checked';
        };

        if (options.help) {
          def_help = '<a class="help" href="/help#colors_default" title="Each letter receives its own color.">' +
            '<span aria-hidden="true" data-icon="?"></span><span class="reader-text">help</span></a>';
          con_help = '<a class="help" href="/help#colors_consensus" title="Letters are colored as in Clustalx and Jalview, with colors depending on composition of the column.">' +
            '<span aria-hidden="true" data-icon="?"></span><span class="reader-text">help</span></a>';
        }

        var color_controls = '<fieldset><legend>Color Scheme</legend>' +
          '<label><input type="radio" name="color" class="logo_color" value="default" ' + def_color +
          '/>Default ' + def_help +
          '</label></br>' +
          '<label><input type="radio" name="color" class="logo_color" value="consensus" ' + con_color +
          '/>Consensus Colors ' + con_help +
          '</label>' +
          '</fieldset>';
        settings.append(color_controls);
      }

      if (logo.data.ali_map) {
        var mod_checked = null,
            ali_checked = null,
            mod_help = '',
            ali_help = '',
            familiy_accession = '';

        if (logo.display_ali_map === 0) {
          mod_checked = 'checked';
        } else {
          ali_checked = 'checked';
        }

        if (options.help) {
          mod_help = '<a class="help" href="/help#coords_model" title="The coordinates along the top of the plot show the model position.">' +
            '<span aria-hidden="true" data-icon="?"></span><span class="reader-text">help</span></a>';
          ali_help = '<a class="help" href="/help#coords_ali" title="The coordinates along the top of the plot show the column in the alignment associated with the model">' +
            '<span aria-hidden="true" data-icon="?"></span><span class="reader-text">help</span></a>';
        }

        var ali_controls = '<fieldset><legend>Coordinates</legend>' +
          '<label><input type="radio" name="coords" class="logo_ali_map" value="model" ' + mod_checked +
          '/>Model ' + mod_help +
          '</label></br>' +
          '<label><input type="radio" name="coords" class="logo_ali_map" value="alignment" ' + ali_checked +
          '/>Alignment ' + ali_help +
          '</label>' +
          '</fieldset>';
        settings.append(ali_controls);

      }

      if (settings.children().length > 0) {
        controls.append('<button class="logo_settings_switch button">Settings</button>');
        controls.append(settings);
      }

      form.append(controls);
      $(this).append(form);


      $(this).find('.logo_settings_switch, .logo_settings .close').bind('click', function (e) {
        e.preventDefault();
        $('.logo_settings').toggle();
      });

      $(this).find('.logo_reset').bind('click', function (e) {
        e.preventDefault();
        var hmm_logo = logo;
        hmm_logo.change_zoom({'target': hmm_logo.default_zoom});
      });

      $(this).find('.logo_change').bind('click', function (e) {
        e.preventDefault();
      });

      $(this).find('.logo_zoomin').bind('click', function (e) {
        e.preventDefault();
        var hmm_logo = logo;
        hmm_logo.change_zoom({'distance': 0.1, 'direction': '+'});
      });

      $(this).find('.logo_zoomout').bind('click', function (e) {
        e.preventDefault();
        var hmm_logo = logo;
        hmm_logo.change_zoom({'distance': 0.1, 'direction': '-'});
      });

      $(this).find('.logo_scale').bind('change', function (e) {
        var hmm_logo = logo;
        hmm_logo.toggle_scale(this.value);
      });

      $(this).find('.logo_color').bind('change', function (e) {
        var hmm_logo = logo;
        hmm_logo.toggle_colorscheme(this.value);
      });

      $(this).find('.logo_ali_map').bind('change', function (e) {
        var hmm_logo = logo;
        hmm_logo.toggle_ali_map(this.value);
      });

      $(this).find('.logo_position').bind('change', function () {
        var hmm_logo = logo;
        if (!this.value.match(/^\d+$/m)) {
          return;
        }
        hmm_logo.scrollToColumn(this.value, 1);
      });

      logo_graphic.bind('dblclick', function (e) {
        // need to get coordinates of mouse click
        var hmm_logo = logo,
          offset = $(this).offset(),
          x = parseInt((e.pageX - offset.left), 10),

          // get mouse position in the window
          window_position = e.pageX - $(this).parent().offset().left,

          // get column number
          col = hmm_logo.columnFromCoordinates(x),

          // choose new zoom level and zoom in.
          current = hmm_logo.zoom;

        if (current < 1) {
          hmm_logo.change_zoom({'target': 1, offset: window_position, column: col});
        } else {
          hmm_logo.change_zoom({'target': 0.3, offset: window_position, column: col});
        }

        return;
      });

      if (options.column_info) {
        logo_graphic.bind('click', function (e) {
          var hmm_logo = logo,
            info_tab = $('<table class="logo_col_info"></table>'),
            header = '<tr>',
            tbody  = '',
            offset = $(this).offset(),
            x = parseInt((e.pageX - offset.left), 10),

            // get mouse position in the window
            window_position = e.pageX - $(this).parent().offset().left,

            // get column number
            col = hmm_logo.columnFromCoordinates(x),
            // clone the column data before reversal or the column gets messed
            // up in the logo when zoom levels change. Also stops flip-flopping
            // of the order from ascending to descending.
            col_data = [],
            info_cols = 0,
            i = 0,
            j = 0,
            height_header = 'Probability';
          hmm_logo.column_clicked = col;
          hmm_logo.refresh();

          if (logo.data.height_calc && logo.data.height_calc === 'score') {
            height_header = 'Score';
            col_data = logo.data.height_arr[col - 1].slice(0).reverse();
          } else {
            col_data = logo.data.probs_arr[col - 1].slice(0).reverse();
          }

          info_cols = Math.ceil(col_data.length / 5);
          //add the headers for each column.
          for (i = 0; i < info_cols; i++) {
            // using the i < info_cols - 1 check to make sure the last column doesn't
            // get marked with the odd class so we don't get a border on the edge of the table.
            if (info_cols > 1 && i < (info_cols - 1)) {
              header += '<th>Residue</th><th class="odd">' + height_header + '</th>';
            } else {
              header += '<th>Residue</th><th>' + height_header + '</th>';
            }
          }


          header += '</tr>';
          info_tab.append($(header));

          // add the data for each column
          for (i = 0; i < 5; i++) {
            tbody += '<tr>';
            j = i;
            while (col_data[j]) {
              var values = col_data[j].split(':', 2),
                color = '';
              if (logo.colorscheme === 'default') {
                color = logo.alphabet + '_' + values[0];
              }
              // using the j < 15 check to make sure the last column doesn't get marked
              // with the odd class so we don't get a border on the edge of the table.
              if (info_cols > 1  &&  j < 15) {
                tbody += '<td class="' + color + '"><div></div>' + values[0] + '</td><td class="odd">' + values[1] + '</td>';
              } else {
                tbody += '<td class="' + color + '"><div></div>' + values[0] + '</td><td>' + values[1] + '</td>';
              }

              j += 5;
            }
            tbody += '</tr>';
          }

          info_tab.append($(tbody));

          $(options.column_info).empty()
            .append($('<p> Column:' + col  + '</p><div><p>Occupancy: ' + logo.data.delete_probs[col - 1] + '</p><p>Insert Probability: ' + logo.data.insert_probs[col - 1] + '</p><p>Insert Length: ' + logo.data.insert_lengths[col - 1] + '</p></div>'))
            .append(info_tab).show();
        });
      }

      logo_graphic.bind('mousemove', function (e) {
        var hmm_logo = logo,
            offset = $(this).offset(),
            x = parseInt((e.pageX - offset.left), 10),
            col = hmm_logo.columnFromCoordinates(x);

        if (hmm_logo.column_hover!=col){
          hmm_logo.column_hover = col;
          hmm_logo.refresh();
        }

      });

      $(document).bind(this.attr('id') + ".scrolledTo", function (e, left, top, zoom) {
        var hmm_logo = logo;
        hmm_logo.render({target: left});
      });

      $(document).keydown(function (e) {
        if (!e.ctrlKey) {
          if (e.which === 61 || e.which === 107) {
            zoom += 0.1;
            logo.change_zoom({'distance': 0.1, 'direction': '+'});
          }
          if (e.which === 109 || e.which === 0) {
            zoom = zoom - 0.1;
            logo.change_zoom({'distance': 0.1, 'direction': '-'});
          }
        }
      });

      // ACTIVE SITES PANEL
      if (logo.active_sites_sources!=null && typeof logo.active_sites_sources == "object") {
        var active_sites = '<fieldset><legend>ActiveSites</legend>' +
            '<label>Source: <select name="member_db" class="logo_ali_map">';
        for (var key in logo.active_sites_sources) {
          active_sites += '<option value="'+key+'">'+key+'</option> ';
        }
        active_sites += '</select></label> ' + // + mod_help +
            '</br>' +
            '<label>Accession number: ' +
            '   <input type="text" name="familiy_accession" class="logo_ali_map" value="PF00199"/>' +
            '</label><br/>' +
            '<button id="active_sites">Get Active Sites</button>' +
            '</fieldset>';

        settings.append(active_sites);
      }

      $(this).find('#active_sites').bind('click', function (e) {
        e.preventDefault();
        var hmm_logo = logo;
        var source = $("select[name=member_db]").val(),
            url = hmm_logo.active_sites_sources[source],
            acc= $("input[name=familiy_accession]").val();
        if (""!=acc.trim()) {
          url = url.replace("[ACCESSION]", acc);
          $.getJSON(url,function(data){
            if (hmm_logo.active_sites_adder==null)
              hmm_logo.active_sites_adder = new ActiveSitesAdder(data,hmm_logo);
            else{
              hmm_logo.active_sites_adder.resetData(data);
            }
            hmm_logo.active_sites_adder.process();
            hmm_logo.show_active_sites = true;
            hmm_logo.refresh();

          });
        }
      });

    } else {
      $('#logo').replaceWith($('#no_canvas').html());
    }

    return logo;
  };
})(jQuery);

},{"./ActiveSites/ActiveSitesAdder.js":2,"./components/canvas_support.js":5,"./components/hmm_logo_canvas":7}]},{},[9]);
/*
 * qTip2 - Pretty powerful tooltips - v2.1.1
 * http://qtip2.com
 *
 * Copyright (c) 2013 Craig Michael Thompson
 * Released under the MIT, GPL licenses
 * http://jquery.org/license
 *
 * Date: Mon Sep 23 2013 07:23 UTC+0000
 * Plugins: tips
 * Styles: css3
 */
/*global window: false, jQuery: false, console: false, define: false */

/* Cache window, document, undefined */
(function( window, document, undefined ) {

// Uses AMD or browser globals to create a jQuery plugin.
(function( factory ) {
	"use strict";
	if(typeof define === 'function' && define.amd) {
		define(['jquery', 'imagesloaded'], factory);
	}
	else if(jQuery && !jQuery.fn.qtip) {
		factory(jQuery);
	}
}
(function($) {
	/* This currently causes issues with Safari 6, so for it's disabled */
	//"use strict"; // (Dis)able ECMAScript "strict" operation for this function. See more: http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

;// Munge the primitives - Paul Irish tip
var TRUE = true,
FALSE = false,
NULL = null,

// Common variables
X = 'x', Y = 'y',
WIDTH = 'width',
HEIGHT = 'height',

// Positioning sides
TOP = 'top',
LEFT = 'left',
BOTTOM = 'bottom',
RIGHT = 'right',
CENTER = 'center',

// Position adjustment types
FLIP = 'flip',
FLIPINVERT = 'flipinvert',
SHIFT = 'shift',

// Shortcut vars
QTIP, PROTOTYPE, CORNER, CHECKS,
PLUGINS = {},
NAMESPACE = 'qtip',
ATTR_HAS = 'data-hasqtip',
ATTR_ID = 'data-qtip-id',
WIDGET = ['ui-widget', 'ui-tooltip'],
SELECTOR = '.'+NAMESPACE,
INACTIVE_EVENTS = 'click dblclick mousedown mouseup mousemove mouseleave mouseenter'.split(' '),

CLASS_FIXED = NAMESPACE+'-fixed',
CLASS_DEFAULT = NAMESPACE + '-default',
CLASS_FOCUS = NAMESPACE + '-focus',
CLASS_HOVER = NAMESPACE + '-hover',
CLASS_DISABLED = NAMESPACE+'-disabled',

replaceSuffix = '_replacedByqTip',
oldtitle = 'oldtitle',
trackingBound;

// Browser detection
BROWSER = {
	/*
	 * IE version detection
	 *
	 * Adapted from: http://ajaxian.com/archives/attack-of-the-ie-conditional-comment
	 * Credit to James Padolsey for the original implemntation!
	 */
	ie: (function(){
		var v = 3, div = document.createElement('div');
		while ((div.innerHTML = '<!--[if gt IE '+(++v)+']><i></i><![endif]-->')) {
			if(!div.getElementsByTagName('i')[0]) { break; }
		}
		return v > 4 ? v : NaN;
	}()),
 
	/*
	 * iOS version detection
	 */
	iOS: parseFloat( 
		('' + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0,''])[1])
		.replace('undefined', '3_2').replace('_', '.').replace('_', '')
	) || FALSE
};

;function QTip(target, options, id, attr) {
	// Elements and ID
	this.id = id;
	this.target = target;
	this.tooltip = NULL;
	this.elements = elements = { target: target };

	// Internal constructs
	this._id = NAMESPACE + '-' + id;
	this.timers = { img: {} };
	this.options = options;
	this.plugins = {};

	// Cache object
	this.cache = cache = {
		event: {},
		target: $(),
		disabled: FALSE,
		attr: attr,
		onTooltip: FALSE,
		lastClass: ''
	};

	// Set the initial flags
	this.rendered = this.destroyed = this.disabled = this.waiting = 
		this.hiddenDuringWait = this.positioning = this.triggering = FALSE;
}
PROTOTYPE = QTip.prototype;

PROTOTYPE.render = function(show) {
	if(this.rendered || this.destroyed) { return this; } // If tooltip has already been rendered, exit

	var self = this,
		options = this.options,
		cache = this.cache,
		elements = this.elements,
		text = options.content.text,
		title = options.content.title,
		button = options.content.button,
		posOptions = options.position,
		namespace = '.'+this._id+' ',
		deferreds = [];

	// Add ARIA attributes to target
	$.attr(this.target[0], 'aria-describedby', this._id);

	// Create tooltip element
	this.tooltip = elements.tooltip = tooltip = $('<div/>', {
		'id': this._id,
		'class': [ NAMESPACE, CLASS_DEFAULT, options.style.classes, NAMESPACE + '-pos-' + options.position.my.abbrev() ].join(' '),
		'width': options.style.width || '',
		'height': options.style.height || '',
		'tracking': posOptions.target === 'mouse' && posOptions.adjust.mouse,

		/* ARIA specific attributes */
		'role': 'alert',
		'aria-live': 'polite',
		'aria-atomic': FALSE,
		'aria-describedby': this._id + '-content',
		'aria-hidden': TRUE
	})
	.toggleClass(CLASS_DISABLED, this.disabled)
	.attr(ATTR_ID, this.id)
	.data(NAMESPACE, this)
	.appendTo(posOptions.container)
	.append(
		// Create content element
		elements.content = $('<div />', {
			'class': NAMESPACE + '-content',
			'id': this._id + '-content',
			'aria-atomic': TRUE
		})
	);

	// Set rendered flag and prevent redundant reposition calls for now
	this.rendered = -1;
	this.positioning = TRUE;

	// Create title...
	if(title) {
		this._createTitle();

		// Update title only if its not a callback (called in toggle if so)
		if(!$.isFunction(title)) {
			deferreds.push( this._updateTitle(title, FALSE) );
		}
	}

	// Create button
	if(button) { this._createButton(); }

	// Set proper rendered flag and update content if not a callback function (called in toggle)
	if(!$.isFunction(text)) {
		deferreds.push( this._updateContent(text, FALSE) );
	}
	this.rendered = TRUE;

	// Setup widget classes
	this._setWidget();

	// Assign passed event callbacks (before plugins!)
	$.each(options.events, function(name, callback) {
		$.isFunction(callback) && tooltip.bind(
			(name === 'toggle' ? ['tooltipshow','tooltiphide'] : ['tooltip'+name])
				.join(namespace)+namespace, callback
		);
	});

	// Initialize 'render' plugins
	$.each(PLUGINS, function(name) {
		var instance;
		if(this.initialize === 'render' && (instance = this(self))) {
			self.plugins[name] = instance;
		}
	});

	// Assign events
	this._assignEvents();

	// When deferreds have completed
	$.when.apply($, deferreds).then(function() {
		// tooltiprender event
		self._trigger('render');

		// Reset flags
		self.positioning = FALSE;

		// Show tooltip if not hidden during wait period
		if(!self.hiddenDuringWait && (options.show.ready || show)) {
			self.toggle(TRUE, cache.event, FALSE);
		}
		self.hiddenDuringWait = FALSE;
	});

	// Expose API
	QTIP.api[this.id] = this;

	return this;
};

PROTOTYPE.destroy = function(immediate) {
	// Set flag the signify destroy is taking place to plugins
	// and ensure it only gets destroyed once!
	if(this.destroyed) { return this.target; }

	function process() {
		if(this.destroyed) { return; }
		this.destroyed = TRUE;
		
		var target = this.target,
			title = target.attr(oldtitle);

		// Destroy tooltip if rendered
		if(this.rendered) {
			this.tooltip.stop(1,0).find('*').remove().end().remove();
		}

		// Destroy all plugins
		$.each(this.plugins, function(name) {
			this.destroy && this.destroy();
		});

		// Clear timers and remove bound events
		clearTimeout(this.timers.show);
		clearTimeout(this.timers.hide);
		this._unassignEvents();

		// Remove api object and ARIA attributes
		target.removeData(NAMESPACE).removeAttr(ATTR_ID)
			.removeAttr('aria-describedby');

		// Reset old title attribute if removed
		if(this.options.suppress && title) {
			target.attr('title', title).removeAttr(oldtitle);
		}

		// Remove qTip events associated with this API
		this._unbind(target);

		// Remove ID from used id objects, and delete object references
		// for better garbage collection and leak protection
		this.options = this.elements = this.cache = this.timers = 
			this.plugins = this.mouse = NULL;

		// Delete epoxsed API object
		delete QTIP.api[this.id];
	}

	// If an immediate destory is needed
	if(immediate !== TRUE && this.rendered) {
		tooltip.one('tooltiphidden', $.proxy(process, this));
		!this.triggering && this.hide();
	}

	// If we're not in the process of hiding... process
	else { process.call(this); }

	return this.target;
};

;function invalidOpt(a) {
	return a === NULL || $.type(a) !== 'object';
}

function invalidContent(c) {
	return !( $.isFunction(c) || (c && c.attr) || c.length || ($.type(c) === 'object' && (c.jquery || c.then) ));
}

// Option object sanitizer
function sanitizeOptions(opts) {
	var content, text, ajax, once;

	if(invalidOpt(opts)) { return FALSE; }

	if(invalidOpt(opts.metadata)) {
		opts.metadata = { type: opts.metadata };
	}

	if('content' in opts) {
		content = opts.content;

		if(invalidOpt(content) || content.jquery || content.done) {
			content = opts.content = {
				text: (text = invalidContent(content) ? FALSE : content)
			};
		}
		else { text = content.text; }

		// DEPRECATED - Old content.ajax plugin functionality
		// Converts it into the proper Deferred syntax
		if('ajax' in content) {
			ajax = content.ajax;
			once = ajax && ajax.once !== FALSE;
			delete content.ajax;

			content.text = function(event, api) {
				var loading = text || $(this).attr(api.options.content.attr) || 'Loading...',

				deferred = $.ajax(
					$.extend({}, ajax, { context: api })
				)
				.then(ajax.success, NULL, ajax.error)
				.then(function(content) {
					if(content && once) { api.set('content.text', content); }
					return content;
				},
				function(xhr, status, error) {
					if(api.destroyed || xhr.status === 0) { return; }
					api.set('content.text', status + ': ' + error);
				});

				return !once ? (api.set('content.text', loading), deferred) : loading;
			};
		}

		if('title' in content) {
			if(!invalidOpt(content.title)) {
				content.button = content.title.button;
				content.title = content.title.text;
			}

			if(invalidContent(content.title || FALSE)) {
				content.title = FALSE;
			}
		}
	}

	if('position' in opts && invalidOpt(opts.position)) {
		opts.position = { my: opts.position, at: opts.position };
	}

	if('show' in opts && invalidOpt(opts.show)) {
		opts.show = opts.show.jquery ? { target: opts.show } : 
			opts.show === TRUE ? { ready: TRUE } : { event: opts.show };
	}

	if('hide' in opts && invalidOpt(opts.hide)) {
		opts.hide = opts.hide.jquery ? { target: opts.hide } : { event: opts.hide };
	}

	if('style' in opts && invalidOpt(opts.style)) {
		opts.style = { classes: opts.style };
	}

	// Sanitize plugin options
	$.each(PLUGINS, function() {
		this.sanitize && this.sanitize(opts);
	});

	return opts;
}

// Setup builtin .set() option checks
CHECKS = PROTOTYPE.checks = {
	builtin: {
		// Core checks
		'^id$': function(obj, o, v, prev) {
			var id = v === TRUE ? QTIP.nextid : v,
				new_id = NAMESPACE + '-' + id;

			if(id !== FALSE && id.length > 0 && !$('#'+new_id).length) {
				this._id = new_id;

				if(this.rendered) {
					this.tooltip[0].id = this._id;
					this.elements.content[0].id = this._id + '-content';
					this.elements.title[0].id = this._id + '-title';
				}
			}
			else { obj[o] = prev; }
		},
		'^prerender': function(obj, o, v) {
			v && !this.rendered && this.render(this.options.show.ready);
		},

		// Content checks
		'^content.text$': function(obj, o, v) {
			this._updateContent(v);
		},
		'^content.attr$': function(obj, o, v, prev) {
			if(this.options.content.text === this.target.attr(prev)) {
				this._updateContent( this.target.attr(v) );
			}
		},
		'^content.title$': function(obj, o, v) {
			// Remove title if content is null
			if(!v) { return this._removeTitle(); }

			// If title isn't already created, create it now and update
			v && !this.elements.title && this._createTitle();
			this._updateTitle(v);
		},
		'^content.button$': function(obj, o, v) {
			this._updateButton(v);
		},
		'^content.title.(text|button)$': function(obj, o, v) {
			this.set('content.'+o, v); // Backwards title.text/button compat
		}, 

		// Position checks
		'^position.(my|at)$': function(obj, o, v){
			'string' === typeof v && (obj[o] = new CORNER(v, o === 'at'));
		},
		'^position.container$': function(obj, o, v){
			this.tooltip.appendTo(v);
		},

		// Show checks
		'^show.ready$': function(obj, o, v) {
			v && (!this.rendered && this.render(TRUE) || this.toggle(TRUE));
		},

		// Style checks
		'^style.classes$': function(obj, o, v, p) {
			this.tooltip.removeClass(p).addClass(v);
		},
		'^style.width|height': function(obj, o, v) {
			this.tooltip.css(o, v);
		},
		'^style.widget|content.title': function() {
			this._setWidget();
		},
		'^style.def': function(obj, o, v) {
			this.tooltip.toggleClass(CLASS_DEFAULT, !!v);
		},

		// Events check
		'^events.(render|show|move|hide|focus|blur)$': function(obj, o, v) {
			tooltip[($.isFunction(v) ? '' : 'un') + 'bind']('tooltip'+o, v);
		},

		// Properties which require event reassignment
		'^(show|hide|position).(event|target|fixed|inactive|leave|distance|viewport|adjust)': function() {
			var posOptions = this.options.position;

			// Set tracking flag
			tooltip.attr('tracking', posOptions.target === 'mouse' && posOptions.adjust.mouse);

			// Reassign events
			this._unassignEvents();
			this._assignEvents();
		}
	}
};

// Dot notation converter
function convertNotation(options, notation) {
	var i = 0, obj, option = options,

	// Split notation into array
	levels = notation.split('.');

	// Loop through
	while( option = option[ levels[i++] ] ) {
		if(i < levels.length) { obj = option; }
	}

	return [obj || options, levels.pop()];
}

PROTOTYPE.get = function(notation) {
	if(this.destroyed) { return this; }

	var o = convertNotation(this.options, notation.toLowerCase()),
		result = o[0][ o[1] ];

	return result.precedance ? result.string() : result;
};

function setCallback(notation, args) {
	var category, rule, match;

	for(category in this.checks) {
		for(rule in this.checks[category]) {
			if(match = (new RegExp(rule, 'i')).exec(notation)) {
				args.push(match);

				if(category === 'builtin' || this.plugins[category]) {
					this.checks[category][rule].apply(
						this.plugins[category] || this, args
					);
				}
			}
		}
	}
}

var rmove = /^position\.(my|at|adjust|target|container|viewport)|style|content|show\.ready/i,
	rrender = /^prerender|show\.ready/i;

PROTOTYPE.set = function(option, value) {
	if(this.destroyed) { return this; }

	var rendered = this.rendered,
		reposition = FALSE,
		options = this.options,
		checks = this.checks,
		name;

	// Convert singular option/value pair into object form
	if('string' === typeof option) {
		name = option; option = {}; option[name] = value;
	}
	else { option = $.extend({}, option); }

	// Set all of the defined options to their new values
	$.each(option, function(notation, value) {
		if(!rendered && !rrender.test(notation)) {
			delete option[notation]; return;
		}

		// Set new obj value
		var obj = convertNotation(options, notation.toLowerCase()), previous;
		previous = obj[0][ obj[1] ];
		obj[0][ obj[1] ] = value && value.nodeType ? $(value) : value;

		// Also check if we need to reposition
		reposition = rmove.test(notation) || reposition;

		// Set the new params for the callback
		option[notation] = [obj[0], obj[1], value, previous];
	});

	// Re-sanitize options
	sanitizeOptions(options);

	/*
	 * Execute any valid callbacks for the set options
	 * Also set positioning flag so we don't get loads of redundant repositioning calls.
	 */
	this.positioning = TRUE;
	$.each(option, $.proxy(setCallback, this));
	this.positioning = FALSE;

	// Update position if needed
	if(this.rendered && this.tooltip[0].offsetWidth > 0 && reposition) {
		this.reposition( options.position.target === 'mouse' ? NULL : this.cache.event );
	}

	return this;
};

;PROTOTYPE._update = function(content, element, reposition) {
	var self = this,
		cache = this.cache;

	// Make sure tooltip is rendered and content is defined. If not return
	if(!this.rendered || !content) { return FALSE; }

	// Use function to parse content
	if($.isFunction(content)) {
		content = content.call(this.elements.target, cache.event, this) || '';
	}

	// Handle deferred content
	if($.isFunction(content.then)) {
		cache.waiting = TRUE;
		return content.then(function(c) {
			cache.waiting = FALSE;
			return self._update(c, element);
		}, NULL, function(e) {
			return self._update(e, element);
		});
	}

	// If content is null... return false
	if(content === FALSE || (!content && content !== '')) { return FALSE; }

	// Append new content if its a DOM array and show it if hidden
	if(content.jquery && content.length > 0) {
		element.children().detach().end().append( content.css({ display: 'block' }) );
	}

	// Content is a regular string, insert the new content
	else { element.html(content); }

	// If imagesLoaded is included, ensure images have loaded and return promise
	cache.waiting = TRUE;

	return ( $.fn.imagesLoaded ? element.imagesLoaded() : $.Deferred().resolve($([])) )
		.done(function(images) {
			cache.waiting = FALSE;

			// Reposition if rendered
			if(images.length && self.rendered && self.tooltip[0].offsetWidth > 0) {
				self.reposition(cache.event, !images.length);
			}
		})
		.promise();
};

PROTOTYPE._updateContent = function(content, reposition) {
	this._update(content, this.elements.content, reposition);
};

PROTOTYPE._updateTitle = function(content, reposition) {
	if(this._update(content, this.elements.title, reposition) === FALSE) {
		this._removeTitle(FALSE);
	}
};

PROTOTYPE._createTitle = function()
{
	var elements = this.elements,
		id = this._id+'-title';

	// Destroy previous title element, if present
	if(elements.titlebar) { this._removeTitle(); }

	// Create title bar and title elements
	elements.titlebar = $('<div />', {
		'class': NAMESPACE + '-titlebar ' + (this.options.style.widget ? createWidgetClass('header') : '')
	})
	.append(
		elements.title = $('<div />', {
			'id': id,
			'class': NAMESPACE + '-title',
			'aria-atomic': TRUE
		})
	)
	.insertBefore(elements.content)

	// Button-specific events
	.delegate('.qtip-close', 'mousedown keydown mouseup keyup mouseout', function(event) {
		$(this).toggleClass('ui-state-active ui-state-focus', event.type.substr(-4) === 'down');
	})
	.delegate('.qtip-close', 'mouseover mouseout', function(event){
		$(this).toggleClass('ui-state-hover', event.type === 'mouseover');
	});

	// Create button if enabled
	if(this.options.content.button) { this._createButton(); }
};

PROTOTYPE._removeTitle = function(reposition)
{
	var elements = this.elements;

	if(elements.title) {
		elements.titlebar.remove();
		elements.titlebar = elements.title = elements.button = NULL;

		// Reposition if enabled
		if(reposition !== FALSE) { this.reposition(); }
	}
};

;PROTOTYPE.reposition = function(event, effect) {
	if(!this.rendered || this.positioning || this.destroyed) { return this; }

	// Set positioning flag
	this.positioning = TRUE;

	var cache = this.cache,
		tooltip = this.tooltip,
		posOptions = this.options.position,
		target = posOptions.target,
		my = posOptions.my,
		at = posOptions.at,
		viewport = posOptions.viewport,
		container = posOptions.container,
		adjust = posOptions.adjust,
		method = adjust.method.split(' '),
		elemWidth = tooltip.outerWidth(FALSE),
		elemHeight = tooltip.outerHeight(FALSE),
		targetWidth = 0,
		targetHeight = 0,
		type = tooltip.css('position'),
		position = { left: 0, top: 0 },
		visible = tooltip[0].offsetWidth > 0,
		isScroll = event && event.type === 'scroll',
		win = $(window),
		doc = container[0].ownerDocument,
		mouse = this.mouse,
		pluginCalculations, offset;

	// Check if absolute position was passed
	if($.isArray(target) && target.length === 2) {
		// Force left top and set position
		at = { x: LEFT, y: TOP };
		position = { left: target[0], top: target[1] };
	}

	// Check if mouse was the target
	else if(target === 'mouse' && ((event && event.pageX) || cache.event.pageX)) {
		// Force left top to allow flipping
		at = { x: LEFT, y: TOP };

		// Use cached event if one isn't available for positioning
		event = mouse && mouse.pageX && (adjust.mouse || !event || !event.pageX) ? mouse :
			(event && (event.type === 'resize' || event.type === 'scroll') ? cache.event :
			event && event.pageX && event.type === 'mousemove' ? event :
			(!adjust.mouse || this.options.show.distance) && cache.origin && cache.origin.pageX ? cache.origin :
			event) || event || cache.event || mouse || {};

		// Calculate body and container offset and take them into account below
		if(type !== 'static') { position = container.offset(); }
		if(doc.body.offsetWidth !== (window.innerWidth || doc.documentElement.clientWidth)) { offset = $(doc.body).offset(); }

		// Use event coordinates for position
		position = {
			left: event.pageX - position.left + (offset && offset.left || 0),
			top: event.pageY - position.top + (offset && offset.top || 0)
		};

		// Scroll events are a pain, some browsers
		if(adjust.mouse && isScroll) {
			position.left -= mouse.scrollX - win.scrollLeft();
			position.top -= mouse.scrollY - win.scrollTop();
		}
	}

	// Target wasn't mouse or absolute...
	else {
		// Check if event targetting is being used
		if(target === 'event' && event && event.target && event.type !== 'scroll' && event.type !== 'resize') {
			cache.target = $(event.target);
		}
		else if(target !== 'event'){
			cache.target = $(target.jquery ? target : elements.target);
		}
		target = cache.target;

		// Parse the target into a jQuery object and make sure there's an element present
		target = $(target).eq(0);
		if(target.length === 0) { return this; }

		// Check if window or document is the target
		else if(target[0] === document || target[0] === window) {
			targetWidth = BROWSER.iOS ? window.innerWidth : target.width();
			targetHeight = BROWSER.iOS ? window.innerHeight : target.height();

			if(target[0] === window) {
				position = {
					top: (viewport || target).scrollTop(),
					left: (viewport || target).scrollLeft()
				};
			}
		}

		// Check if the target is an <AREA> element
		else if(PLUGINS.imagemap && target.is('area')) {
			pluginCalculations = PLUGINS.imagemap(this, target, at, PLUGINS.viewport ? method : FALSE);
		}

		// Check if the target is an SVG element
		else if(PLUGINS.svg && target[0].ownerSVGElement) {
			pluginCalculations = PLUGINS.svg(this, target, at, PLUGINS.viewport ? method : FALSE);
		}

		// Otherwise use regular jQuery methods
		else {
			targetWidth = target.outerWidth(FALSE);
			targetHeight = target.outerHeight(FALSE);
			position = target.offset();
		}

		// Parse returned plugin values into proper variables
		if(pluginCalculations) {
			targetWidth = pluginCalculations.width;
			targetHeight = pluginCalculations.height;
			offset = pluginCalculations.offset;
			position = pluginCalculations.position;
		}

		// Adjust position to take into account offset parents
		position = this.reposition.offset(target, position, container);

		// Adjust for position.fixed tooltips (and also iOS scroll bug in v3.2-4.0 & v4.3-4.3.2)
		if((BROWSER.iOS > 3.1 && BROWSER.iOS < 4.1) || 
			(BROWSER.iOS >= 4.3 && BROWSER.iOS < 4.33) || 
			(!BROWSER.iOS && type === 'fixed')
		){
			position.left -= win.scrollLeft();
			position.top -= win.scrollTop();
		}

		// Adjust position relative to target
		if(!pluginCalculations || (pluginCalculations && pluginCalculations.adjustable !== FALSE)) {
			position.left += at.x === RIGHT ? targetWidth : at.x === CENTER ? targetWidth / 2 : 0;
			position.top += at.y === BOTTOM ? targetHeight : at.y === CENTER ? targetHeight / 2 : 0;
		}
	}

	// Adjust position relative to tooltip
	position.left += adjust.x + (my.x === RIGHT ? -elemWidth : my.x === CENTER ? -elemWidth / 2 : 0);
	position.top += adjust.y + (my.y === BOTTOM ? -elemHeight : my.y === CENTER ? -elemHeight / 2 : 0);

	// Use viewport adjustment plugin if enabled
	if(PLUGINS.viewport) {
		position.adjusted = PLUGINS.viewport(
			this, position, posOptions, targetWidth, targetHeight, elemWidth, elemHeight
		);

		// Apply offsets supplied by positioning plugin (if used)
		if(offset && position.adjusted.left) { position.left += offset.left; }
		if(offset && position.adjusted.top) {  position.top += offset.top; }
	}

	// Viewport adjustment is disabled, set values to zero
	else { position.adjusted = { left: 0, top: 0 }; }

	// tooltipmove event
	if(!this._trigger('move', [position, viewport.elem || viewport], event)) { return this; }
	delete position.adjusted;

	// If effect is disabled, target it mouse, no animation is defined or positioning gives NaN out, set CSS directly
	if(effect === FALSE || !visible || isNaN(position.left) || isNaN(position.top) || target === 'mouse' || !$.isFunction(posOptions.effect)) {
		tooltip.css(position);
	}

	// Use custom function if provided
	else if($.isFunction(posOptions.effect)) {
		posOptions.effect.call(tooltip, this, $.extend({}, position));
		tooltip.queue(function(next) {
			// Reset attributes to avoid cross-browser rendering bugs
			$(this).css({ opacity: '', height: '' });
			if(BROWSER.ie) { this.style.removeAttribute('filter'); }

			next();
		});
	}

	// Set positioning flag
	this.positioning = FALSE;

	return this;
};

// Custom (more correct for qTip!) offset calculator
PROTOTYPE.reposition.offset = function(elem, pos, container) {
	if(!container[0]) { return pos; }

	var ownerDocument = $(elem[0].ownerDocument),
		quirks = !!BROWSER.ie && document.compatMode !== 'CSS1Compat',
		parent = container[0],
		scrolled, position, parentOffset, overflow;

	function scroll(e, i) {
		pos.left += i * e.scrollLeft();
		pos.top += i * e.scrollTop();
	}

	// Compensate for non-static containers offset
	do {
		if((position = $.css(parent, 'position')) !== 'static') {
			if(position === 'fixed') {
				parentOffset = parent.getBoundingClientRect();
				scroll(ownerDocument, -1);
			}
			else {
				parentOffset = $(parent).position();
				parentOffset.left += (parseFloat($.css(parent, 'borderLeftWidth')) || 0);
				parentOffset.top += (parseFloat($.css(parent, 'borderTopWidth')) || 0);
			}

			pos.left -= parentOffset.left + (parseFloat($.css(parent, 'marginLeft')) || 0);
			pos.top -= parentOffset.top + (parseFloat($.css(parent, 'marginTop')) || 0);

			// If this is the first parent element with an overflow of "scroll" or "auto", store it
			if(!scrolled && (overflow = $.css(parent, 'overflow')) !== 'hidden' && overflow !== 'visible') { scrolled = $(parent); }
		}
	}
	while((parent = parent.offsetParent));

	// Compensate for containers scroll if it also has an offsetParent (or in IE quirks mode)
	if(scrolled && (scrolled[0] !== ownerDocument[0] || quirks)) {
		scroll(scrolled, 1);
	}

	return pos;
};

// Corner class
var C = (CORNER = PROTOTYPE.reposition.Corner = function(corner, forceY) {
	corner = ('' + corner).replace(/([A-Z])/, ' $1').replace(/middle/gi, CENTER).toLowerCase();
	this.x = (corner.match(/left|right/i) || corner.match(/center/) || ['inherit'])[0].toLowerCase();
	this.y = (corner.match(/top|bottom|center/i) || ['inherit'])[0].toLowerCase();
	this.forceY = !!forceY;

	var f = corner.charAt(0);
	this.precedance = (f === 't' || f === 'b' ? Y : X);
}).prototype;

C.invert = function(z, center) {
	this[z] = this[z] === LEFT ? RIGHT : this[z] === RIGHT ? LEFT : center || this[z];	
};

C.string = function() {
	var x = this.x, y = this.y;
	return x === y ? x : this.precedance === Y || (this.forceY && y !== 'center') ? y+' '+x : x+' '+y;
};

C.abbrev = function() {
	var result = this.string().split(' ');
	return result[0].charAt(0) + (result[1] && result[1].charAt(0) || '');
};

C.clone = function() {
	return new CORNER( this.string(), this.forceY );
};;
PROTOTYPE.toggle = function(state, event) {
	var cache = this.cache,
		options = this.options,
		tooltip = this.tooltip;

	// Try to prevent flickering when tooltip overlaps show element
	if(event) {
		if((/over|enter/).test(event.type) && (/out|leave/).test(cache.event.type) &&
			options.show.target.add(event.target).length === options.show.target.length &&
			tooltip.has(event.relatedTarget).length) {
			return this;
		}

		// Cache event
		cache.event = $.extend({}, event);
	}
		
	// If we're currently waiting and we've just hidden... stop it
	this.waiting && !state && (this.hiddenDuringWait = TRUE);

	// Render the tooltip if showing and it isn't already
	if(!this.rendered) { return state ? this.render(1) : this; }
	else if(this.destroyed || this.disabled) { return this; }

	var type = state ? 'show' : 'hide',
		opts = this.options[type],
		otherOpts = this.options[ !state ? 'show' : 'hide' ],
		posOptions = this.options.position,
		contentOptions = this.options.content,
		width = this.tooltip.css('width'),
		visible = this.tooltip[0].offsetWidth > 0,
		animate = state || opts.target.length === 1,
		sameTarget = !event || opts.target.length < 2 || cache.target[0] === event.target,
		identicalState, allow, showEvent, delay;

	// Detect state if valid one isn't provided
	if((typeof state).search('boolean|number')) { state = !visible; }

	// Check if the tooltip is in an identical state to the new would-be state
	identicalState = !tooltip.is(':animated') && visible === state && sameTarget;

	// Fire tooltip(show/hide) event and check if destroyed
	allow = !identicalState ? !!this._trigger(type, [90]) : NULL;

	// If the user didn't stop the method prematurely and we're showing the tooltip, focus it
	if(allow !== FALSE && state) { this.focus(event); }

	// If the state hasn't changed or the user stopped it, return early
	if(!allow || identicalState) { return this; }

	// Set ARIA hidden attribute
	$.attr(tooltip[0], 'aria-hidden', !!!state);

	// Execute state specific properties
	if(state) {
		// Store show origin coordinates
		cache.origin = $.extend({}, this.mouse);

		// Update tooltip content & title if it's a dynamic function
		if($.isFunction(contentOptions.text)) { this._updateContent(contentOptions.text, FALSE); }
		if($.isFunction(contentOptions.title)) { this._updateTitle(contentOptions.title, FALSE); }

		// Cache mousemove events for positioning purposes (if not already tracking)
		if(!trackingBound && posOptions.target === 'mouse' && posOptions.adjust.mouse) {
			$(document).bind('mousemove.'+NAMESPACE, this._storeMouse);
			trackingBound = TRUE;
		}

		// Update the tooltip position (set width first to prevent viewport/max-width issues)
		if(!width) { tooltip.css('width', tooltip.outerWidth(FALSE)); }
		this.reposition(event, arguments[2]);
		if(!width) { tooltip.css('width', ''); }

		// Hide other tooltips if tooltip is solo
		if(!!opts.solo) {
			(typeof opts.solo === 'string' ? $(opts.solo) : $(SELECTOR, opts.solo))
				.not(tooltip).not(opts.target).qtip('hide', $.Event('tooltipsolo'));
		}
	}
	else {
		// Clear show timer if we're hiding
		clearTimeout(this.timers.show);

		// Remove cached origin on hide
		delete cache.origin;

		// Remove mouse tracking event if not needed (all tracking qTips are hidden)
		if(trackingBound && !$(SELECTOR+'[tracking="true"]:visible', opts.solo).not(tooltip).length) {
			$(document).unbind('mousemove.'+NAMESPACE);
			trackingBound = FALSE;
		}

		// Blur the tooltip
		this.blur(event);
	}

	// Define post-animation, state specific properties
	after = $.proxy(function() {
		if(state) {
			// Prevent antialias from disappearing in IE by removing filter
			if(BROWSER.ie) { tooltip[0].style.removeAttribute('filter'); }

			// Remove overflow setting to prevent tip bugs
			tooltip.css('overflow', '');

			// Autofocus elements if enabled
			if('string' === typeof opts.autofocus) {
				$(this.options.show.autofocus, tooltip).focus();
			}

			// If set, hide tooltip when inactive for delay period
			this.options.show.target.trigger('qtip-'+this.id+'-inactive');
		}
		else {
			// Reset CSS states
			tooltip.css({
				display: '',
				visibility: '',
				opacity: '',
				left: '',
				top: ''
			});
		}

		// tooltipvisible/tooltiphidden events
		this._trigger(state ? 'visible' : 'hidden');
	}, this);

	// If no effect type is supplied, use a simple toggle
	if(opts.effect === FALSE || animate === FALSE) {
		tooltip[ type ]();
		after();
	}

	// Use custom function if provided
	else if($.isFunction(opts.effect)) {
		tooltip.stop(1, 1);
		opts.effect.call(tooltip, this);
		tooltip.queue('fx', function(n) {
			after(); n();
		});
	}

	// Use basic fade function by default
	else { tooltip.fadeTo(90, state ? 1 : 0, after); }

	// If inactive hide method is set, active it
	if(state) { opts.target.trigger('qtip-'+this.id+'-inactive'); }

	return this;
};

PROTOTYPE.show = function(event) { return this.toggle(TRUE, event); };

PROTOTYPE.hide = function(event) { return this.toggle(FALSE, event); };

;PROTOTYPE.focus = function(event) {
	if(!this.rendered || this.destroyed) { return this; }

	var qtips = $(SELECTOR),
		tooltip = this.tooltip,
		curIndex = parseInt(tooltip[0].style.zIndex, 10),
		newIndex = QTIP.zindex + qtips.length,
		focusedElem;

	// Only update the z-index if it has changed and tooltip is not already focused
	if(!tooltip.hasClass(CLASS_FOCUS)) {
		// tooltipfocus event
		if(this._trigger('focus', [newIndex], event)) {
			// Only update z-index's if they've changed
			if(curIndex !== newIndex) {
				// Reduce our z-index's and keep them properly ordered
				qtips.each(function() {
					if(this.style.zIndex > curIndex) {
						this.style.zIndex = this.style.zIndex - 1;
					}
				});

				// Fire blur event for focused tooltip
				qtips.filter('.' + CLASS_FOCUS).qtip('blur', event);
			}

			// Set the new z-index
			tooltip.addClass(CLASS_FOCUS)[0].style.zIndex = newIndex;
		}
	}

	return this;
};

PROTOTYPE.blur = function(event) {
	if(!this.rendered || this.destroyed) { return this; }

	// Set focused status to FALSE
	this.tooltip.removeClass(CLASS_FOCUS);

	// tooltipblur event
	this._trigger('blur', [ this.tooltip.css('zIndex') ], event);

	return this;
};

;PROTOTYPE.disable = function(state) {
	if(this.destroyed) { return this; }

	if('boolean' !== typeof state) {
		state = !(this.tooltip.hasClass(CLASS_DISABLED) || this.disabled);
	}

	if(this.rendered) {
		this.tooltip.toggleClass(CLASS_DISABLED, state)
			.attr('aria-disabled', state);
	}

	this.disabled = !!state;

	return this;
};

PROTOTYPE.enable = function() { return this.disable(FALSE); };

;PROTOTYPE._createButton = function()
{
	var self = this,
		elements = this.elements,
		tooltip = elements.tooltip,
		button = this.options.content.button,
		isString = typeof button === 'string',
		close = isString ? button : 'Close tooltip';

	if(elements.button) { elements.button.remove(); }

	// Use custom button if one was supplied by user, else use default
	if(button.jquery) {
		elements.button = button;
	}
	else {
		elements.button = $('<a />', {
			'class': 'qtip-close ' + (this.options.style.widget ? '' : NAMESPACE+'-icon'),
			'title': close,
			'aria-label': close
		})
		.prepend(
			$('<span />', {
				'class': 'ui-icon ui-icon-close',
				'html': '&times;'
			})
		);
	}

	// Create button and setup attributes
	elements.button.appendTo(elements.titlebar || tooltip)
		.attr('role', 'button')
		.click(function(event) {
			if(!tooltip.hasClass(CLASS_DISABLED)) { self.hide(event); }
			return FALSE;
		});
};

PROTOTYPE._updateButton = function(button)
{
	// Make sure tooltip is rendered and if not, return
	if(!this.rendered) { return FALSE; }

	var elem = this.elements.button;
	if(button) { this._createButton(); }
	else { elem.remove(); }
};

;// Widget class creator
function createWidgetClass(cls) {
	return WIDGET.concat('').join(cls ? '-'+cls+' ' : ' ');
}

// Widget class setter method
PROTOTYPE._setWidget = function()
{
	var on = this.options.style.widget,
		elements = this.elements,
		tooltip = elements.tooltip,
		disabled = tooltip.hasClass(CLASS_DISABLED);

	tooltip.removeClass(CLASS_DISABLED);
	CLASS_DISABLED = on ? 'ui-state-disabled' : 'qtip-disabled';
	tooltip.toggleClass(CLASS_DISABLED, disabled);

	tooltip.toggleClass('ui-helper-reset '+createWidgetClass(), on).toggleClass(CLASS_DEFAULT, this.options.style.def && !on);
	
	if(elements.content) {
		elements.content.toggleClass( createWidgetClass('content'), on);
	}
	if(elements.titlebar) {
		elements.titlebar.toggleClass( createWidgetClass('header'), on);
	}
	if(elements.button) {
		elements.button.toggleClass(NAMESPACE+'-icon', !on);
	}
};;function showMethod(event) {
	if(this.tooltip.hasClass(CLASS_DISABLED)) { return FALSE; }

	// Clear hide timers
	clearTimeout(this.timers.show);
	clearTimeout(this.timers.hide);

	// Start show timer
	var callback = $.proxy(function(){ this.toggle(TRUE, event); }, this);
	if(this.options.show.delay > 0) {
		this.timers.show = setTimeout(callback, this.options.show.delay);
	}
	else{ callback(); }
}

function hideMethod(event) {
	if(this.tooltip.hasClass(CLASS_DISABLED)) { return FALSE; }

	// Check if new target was actually the tooltip element
	var relatedTarget = $(event.relatedTarget),
		ontoTooltip = relatedTarget.closest(SELECTOR)[0] === this.tooltip[0],
		ontoTarget = relatedTarget[0] === this.options.show.target[0];

	// Clear timers and stop animation queue
	clearTimeout(this.timers.show);
	clearTimeout(this.timers.hide);

	// Prevent hiding if tooltip is fixed and event target is the tooltip.
	// Or if mouse positioning is enabled and cursor momentarily overlaps
	if(this !== relatedTarget[0] && 
		(this.options.position.target === 'mouse' && ontoTooltip) || 
		(this.options.hide.fixed && (
			(/mouse(out|leave|move)/).test(event.type) && (ontoTooltip || ontoTarget))
		))
	{
		try {
			event.preventDefault();
			event.stopImmediatePropagation();
		} catch(e) {}

		return;
	}

	// If tooltip has displayed, start hide timer
	var callback = $.proxy(function(){ this.toggle(FALSE, event); }, this);
	if(this.options.hide.delay > 0) {
		this.timers.hide = setTimeout(callback, this.options.hide.delay);
	}
	else{ callback(); }
}

function inactiveMethod(event) {
	if(this.tooltip.hasClass(CLASS_DISABLED) || !this.options.hide.inactive) { return FALSE; }

	// Clear timer
	clearTimeout(this.timers.inactive);
	this.timers.inactive = setTimeout(
		$.proxy(function(){ this.hide(event); }, this), this.options.hide.inactive
	);
}

function repositionMethod(event) {
	if(this.rendered && this.tooltip[0].offsetWidth > 0) { this.reposition(event); }
}

// Store mouse coordinates
PROTOTYPE._storeMouse = function(event) {
	this.mouse = {
		pageX: event.pageX,
		pageY: event.pageY,
		type: 'mousemove',
		scrollX: window.pageXOffset || document.body.scrollLeft || document.documentElement.scrollLeft,
		scrollY: window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop
	};
};

// Bind events
PROTOTYPE._bind = function(targets, events, method, suffix, context) {
	var ns = '.' + this._id + (suffix ? '-'+suffix : '');
	events.length && $(targets).bind(
		(events.split ? events : events.join(ns + ' ')) + ns,
		$.proxy(method, context || this)
	);
};
PROTOTYPE._unbind = function(targets, suffix) {
	$(targets).unbind('.' + this._id + (suffix ? '-'+suffix : ''));
};

// Apply common event handlers using delegate (avoids excessive .bind calls!)
var ns = '.'+NAMESPACE;
function delegate(selector, events, method) {	
	$(document.body).delegate(selector,
		(events.split ? events : events.join(ns + ' ')) + ns,
		function() {
			var api = QTIP.api[ $.attr(this, ATTR_ID) ];
			api && !api.disabled && method.apply(api, arguments);
		}
	);
}

$(function() {
	delegate(SELECTOR, ['mouseenter', 'mouseleave'], function(event) {
		var state = event.type === 'mouseenter',
			tooltip = $(event.currentTarget),
			target = $(event.relatedTarget || event.target),
			options = this.options;

		// On mouseenter...
		if(state) {
			// Focus the tooltip on mouseenter (z-index stacking)
			this.focus(event);

			// Clear hide timer on tooltip hover to prevent it from closing
			tooltip.hasClass(CLASS_FIXED) && !tooltip.hasClass(CLASS_DISABLED) && clearTimeout(this.timers.hide);
		}

		// On mouseleave...
		else {
			// Hide when we leave the tooltip and not onto the show target (if a hide event is set)
			if(options.position.target === 'mouse' && options.hide.event && 
				options.show.target && !target.closest(options.show.target[0]).length) {
				this.hide(event);
			}
		}

		// Add hover class
		tooltip.toggleClass(CLASS_HOVER, state);
	});

	// Define events which reset the 'inactive' event handler
	delegate('['+ATTR_ID+']', INACTIVE_EVENTS, inactiveMethod);
});

// Event trigger
PROTOTYPE._trigger = function(type, args, event) {
	var callback = $.Event('tooltip'+type);
	callback.originalEvent = (event && $.extend({}, event)) || this.cache.event || NULL;

	this.triggering = TRUE;
	this.tooltip.trigger(callback, [this].concat(args || []));
	this.triggering = FALSE;

	return !callback.isDefaultPrevented();
};

// Event assignment method
PROTOTYPE._assignEvents = function() {
	var options = this.options,
		posOptions = options.position,

		tooltip = this.tooltip,
		showTarget = options.show.target,
		hideTarget = options.hide.target,
		containerTarget = posOptions.container,
		viewportTarget = posOptions.viewport,
		documentTarget = $(document),
		bodyTarget = $(document.body),
		windowTarget = $(window),

		showEvents = options.show.event ? $.trim('' + options.show.event).split(' ') : [],
		hideEvents = options.hide.event ? $.trim('' + options.hide.event).split(' ') : [],
		toggleEvents = [];

	// Hide tooltips when leaving current window/frame (but not select/option elements)
	if(/mouse(out|leave)/i.test(options.hide.event) && options.hide.leave === 'window') {
		this._bind(documentTarget, ['mouseout', 'blur'], function(event) {
			if(!/select|option/.test(event.target.nodeName) && !event.relatedTarget) {
				this.hide(event);
			}
		});
	}

	// Enable hide.fixed by adding appropriate class
	if(options.hide.fixed) {
		hideTarget = hideTarget.add( tooltip.addClass(CLASS_FIXED) );
	}

	/*
	 * Make sure hoverIntent functions properly by using mouseleave to clear show timer if
	 * mouseenter/mouseout is used for show.event, even if it isn't in the users options.
	 */
	else if(/mouse(over|enter)/i.test(options.show.event)) {
		this._bind(hideTarget, 'mouseleave', function() {
			clearTimeout(this.timers.show);
		});
	}

	// Hide tooltip on document mousedown if unfocus events are enabled
	if(('' + options.hide.event).indexOf('unfocus') > -1) {
		this._bind(containerTarget.closest('html'), ['mousedown', 'touchstart'], function(event) {
			var elem = $(event.target),
				enabled = this.rendered && !this.tooltip.hasClass(CLASS_DISABLED) && this.tooltip[0].offsetWidth > 0,
				isAncestor = elem.parents(SELECTOR).filter(this.tooltip[0]).length > 0;

			if(elem[0] !== this.target[0] && elem[0] !== this.tooltip[0] && !isAncestor &&
				!this.target.has(elem[0]).length && enabled
			) {
				this.hide(event);
			}
		});
	}

	// Check if the tooltip hides when inactive
	if('number' === typeof options.hide.inactive) {
		// Bind inactive method to show target(s) as a custom event
		this._bind(showTarget, 'qtip-'+this.id+'-inactive', inactiveMethod);

		// Define events which reset the 'inactive' event handler
		this._bind(hideTarget.add(tooltip), QTIP.inactiveEvents, inactiveMethod, '-inactive');
	}

	// Apply hide events (and filter identical show events)
	hideEvents = $.map(hideEvents, function(type) {
		var showIndex = $.inArray(type, showEvents);

		// Both events and targets are identical, apply events using a toggle
		if((showIndex > -1 && hideTarget.add(showTarget).length === hideTarget.length)) {
			toggleEvents.push( showEvents.splice( showIndex, 1 )[0] ); return;
		}

		return type;
	});

	// Apply show/hide/toggle events
	this._bind(showTarget, showEvents, showMethod);
	this._bind(hideTarget, hideEvents, hideMethod);
	this._bind(showTarget, toggleEvents, function(event) {
		(this.tooltip[0].offsetWidth > 0 ? hideMethod : showMethod).call(this, event);
	});


	// Mouse movement bindings
	this._bind(showTarget.add(tooltip), 'mousemove', function(event) {
		// Check if the tooltip hides when mouse is moved a certain distance
		if('number' === typeof options.hide.distance) {
			var origin = this.cache.origin || {},
				limit = this.options.hide.distance,
				abs = Math.abs;

			// Check if the movement has gone beyond the limit, and hide it if so
			if(abs(event.pageX - origin.pageX) >= limit || abs(event.pageY - origin.pageY) >= limit) {
				this.hide(event);
			}
		}

		// Cache mousemove coords on show targets
		this._storeMouse(event);
	});

	// Mouse positioning events
	if(posOptions.target === 'mouse') {
		// If mouse adjustment is on...
		if(posOptions.adjust.mouse) {
			// Apply a mouseleave event so we don't get problems with overlapping
			if(options.hide.event) {
				// Track if we're on the target or not
				this._bind(showTarget, ['mouseenter', 'mouseleave'], function(event) {
					this.cache.onTarget = event.type === 'mouseenter';
				});
			}

			// Update tooltip position on mousemove
			this._bind(documentTarget, 'mousemove', function(event) {
				// Update the tooltip position only if the tooltip is visible and adjustment is enabled
				if(this.rendered && this.cache.onTarget && !this.tooltip.hasClass(CLASS_DISABLED) && this.tooltip[0].offsetWidth > 0) {
					this.reposition(event);
				}
			});
		}
	}

	// Adjust positions of the tooltip on window resize if enabled
	if(posOptions.adjust.resize || viewportTarget.length) {
		this._bind( $.event.special.resize ? viewportTarget : windowTarget, 'resize', repositionMethod );
	}

	// Adjust tooltip position on scroll of the window or viewport element if present
	if(posOptions.adjust.scroll) {
		this._bind( windowTarget.add(posOptions.container), 'scroll', repositionMethod );
	}
};

// Un-assignment method
PROTOTYPE._unassignEvents = function() {
	var targets = [
		this.options.show.target[0],
		this.options.hide.target[0],
		this.rendered && this.tooltip[0],
		this.options.position.container[0],
		this.options.position.viewport[0],
		this.options.position.container.closest('html')[0], // unfocus
		window,
		document
	];

	// Check if tooltip is rendered
	if(this.rendered) {
		this._unbind($([]).pushStack( $.grep(targets, function(i) {
			return typeof i === 'object';
		})));
	}

	// Tooltip isn't yet rendered, remove render event
	else { $(targets[0]).unbind('.'+this._id+'-create'); }
};

;// Initialization method
function init(elem, id, opts)
{
	var obj, posOptions, attr, config, title,

	// Setup element references
	docBody = $(document.body),

	// Use document body instead of document element if needed
	newTarget = elem[0] === document ? docBody : elem,

	// Grab metadata from element if plugin is present
	metadata = (elem.metadata) ? elem.metadata(opts.metadata) : NULL,

	// If metadata type if HTML5, grab 'name' from the object instead, or use the regular data object otherwise
	metadata5 = opts.metadata.type === 'html5' && metadata ? metadata[opts.metadata.name] : NULL,

	// Grab data from metadata.name (or data-qtipopts as fallback) using .data() method,
	html5 = elem.data(opts.metadata.name || 'qtipopts');

	// If we don't get an object returned attempt to parse it manualyl without parseJSON
	try { html5 = typeof html5 === 'string' ? $.parseJSON(html5) : html5; } catch(e) {}

	// Merge in and sanitize metadata
	config = $.extend(TRUE, {}, QTIP.defaults, opts,
		typeof html5 === 'object' ? sanitizeOptions(html5) : NULL,
		sanitizeOptions(metadata5 || metadata));

	// Re-grab our positioning options now we've merged our metadata and set id to passed value
	posOptions = config.position;
	config.id = id;

	// Setup missing content if none is detected
	if('boolean' === typeof config.content.text) {
		attr = elem.attr(config.content.attr);

		// Grab from supplied attribute if available
		if(config.content.attr !== FALSE && attr) { config.content.text = attr; }

		// No valid content was found, abort render
		else { return FALSE; }
	}

	// Setup target options
	if(!posOptions.container.length) { posOptions.container = docBody; }
	if(posOptions.target === FALSE) { posOptions.target = newTarget; }
	if(config.show.target === FALSE) { config.show.target = newTarget; }
	if(config.show.solo === TRUE) { config.show.solo = posOptions.container.closest('body'); }
	if(config.hide.target === FALSE) { config.hide.target = newTarget; }
	if(config.position.viewport === TRUE) { config.position.viewport = posOptions.container; }

	// Ensure we only use a single container
	posOptions.container = posOptions.container.eq(0);

	// Convert position corner values into x and y strings
	posOptions.at = new CORNER(posOptions.at, TRUE);
	posOptions.my = new CORNER(posOptions.my);

	// Destroy previous tooltip if overwrite is enabled, or skip element if not
	if(elem.data(NAMESPACE)) {
		if(config.overwrite) {
			elem.qtip('destroy');
		}
		else if(config.overwrite === FALSE) {
			return FALSE;
		}
	}

	// Add has-qtip attribute
	elem.attr(ATTR_HAS, id);

	// Remove title attribute and store it if present
	if(config.suppress && (title = elem.attr('title'))) {
		// Final attr call fixes event delegatiom and IE default tooltip showing problem
		elem.removeAttr('title').attr(oldtitle, title).attr('title', '');
	}

	// Initialize the tooltip and add API reference
	obj = new QTip(elem, config, id, !!attr);
	elem.data(NAMESPACE, obj);

	// Catch remove/removeqtip events on target element to destroy redundant tooltip
	elem.one('remove.qtip-'+id+' removeqtip.qtip-'+id, function() { 
		var api; if((api = $(this).data(NAMESPACE))) { api.destroy(); }
	});

	return obj;
}

// jQuery $.fn extension method
QTIP = $.fn.qtip = function(options, notation, newValue)
{
	var command = ('' + options).toLowerCase(), // Parse command
		returned = NULL,
		args = $.makeArray(arguments).slice(1),
		event = args[args.length - 1],
		opts = this[0] ? $.data(this[0], NAMESPACE) : NULL;

	// Check for API request
	if((!arguments.length && opts) || command === 'api') {
		return opts;
	}

	// Execute API command if present
	else if('string' === typeof options)
	{
		this.each(function()
		{
			var api = $.data(this, NAMESPACE);
			if(!api) { return TRUE; }

			// Cache the event if possible
			if(event && event.timeStamp) { api.cache.event = event; }

			// Check for specific API commands
			if(notation && (command === 'option' || command === 'options')) {
				if(newValue !== undefined || $.isPlainObject(notation)) {
					api.set(notation, newValue);
				}
				else {
					returned = api.get(notation);
					return FALSE;
				}
			}

			// Execute API command
			else if(api[command]) {
				api[command].apply(api, args);
			}
		});

		return returned !== NULL ? returned : this;
	}

	// No API commands. validate provided options and setup qTips
	else if('object' === typeof options || !arguments.length)
	{
		opts = sanitizeOptions($.extend(TRUE, {}, options));

		// Bind the qTips
		return QTIP.bind.call(this, opts, event);
	}
};

// $.fn.qtip Bind method
QTIP.bind = function(opts, event)
{
	return this.each(function(i) {
		var options, targets, events, namespace, api, id;

		// Find next available ID, or use custom ID if provided
		id = $.isArray(opts.id) ? opts.id[i] : opts.id;
		id = !id || id === FALSE || id.length < 1 || QTIP.api[id] ? QTIP.nextid++ : id;

		// Setup events namespace
		namespace = '.qtip-'+id+'-create';

		// Initialize the qTip and re-grab newly sanitized options
		api = init($(this), id, opts);
		if(api === FALSE) { return TRUE; }
		else { QTIP.api[id] = api; }
		options = api.options;

		// Initialize plugins
		$.each(PLUGINS, function() {
			if(this.initialize === 'initialize') { this(api); }
		});

		// Determine hide and show targets
		targets = { show: options.show.target, hide: options.hide.target };
		events = {
			show: $.trim('' + options.show.event).replace(/ /g, namespace+' ') + namespace,
			hide: $.trim('' + options.hide.event).replace(/ /g, namespace+' ') + namespace
		};

		/*
		 * Make sure hoverIntent functions properly by using mouseleave as a hide event if
		 * mouseenter/mouseout is used for show.event, even if it isn't in the users options.
		 */
		if(/mouse(over|enter)/i.test(events.show) && !/mouse(out|leave)/i.test(events.hide)) {
			events.hide += ' mouseleave' + namespace;
		}

		/*
		 * Also make sure initial mouse targetting works correctly by caching mousemove coords
		 * on show targets before the tooltip has rendered.
		 *
		 * Also set onTarget when triggered to keep mouse tracking working
		 */
		targets.show.bind('mousemove'+namespace, function(event) {
			api._storeMouse(event);
			api.cache.onTarget = TRUE;
		});

		// Define hoverIntent function
		function hoverIntent(event) {
			function render() {
				// Cache mouse coords,render and render the tooltip
				api.render(typeof event === 'object' || options.show.ready);

				// Unbind show and hide events
				targets.show.add(targets.hide).unbind(namespace);
			}

			// Only continue if tooltip isn't disabled
			if(api.disabled) { return FALSE; }

			// Cache the event data
			api.cache.event = $.extend({}, event);
			api.cache.target = event ? $(event.target) : [undefined];

			// Start the event sequence
			if(options.show.delay > 0) {
				clearTimeout(api.timers.show);
				api.timers.show = setTimeout(render, options.show.delay);
				if(events.show !== events.hide) {
					targets.hide.bind(events.hide, function() { clearTimeout(api.timers.show); });
				}
			}
			else { render(); }
		}

		// Bind show events to target
		targets.show.bind(events.show, hoverIntent);

		// Prerendering is enabled, create tooltip now
		if(options.show.ready || options.prerender) { hoverIntent(event); }
	});
};

// Populated in render method
QTIP.api = {};
;$.each({
	/* Allow other plugins to successfully retrieve the title of an element with a qTip applied */
	attr: function(attr, val) {
		if(this.length) {
			var self = this[0],
				title = 'title',
				api = $.data(self, 'qtip');

			if(attr === title && api && 'object' === typeof api && api.options.suppress) {
				if(arguments.length < 2) {
					return $.attr(self, oldtitle);
				}

				// If qTip is rendered and title was originally used as content, update it
				if(api && api.options.content.attr === title && api.cache.attr) {
					api.set('content.text', val);
				}

				// Use the regular attr method to set, then cache the result
				return this.attr(oldtitle, val);
			}
		}

		return $.fn['attr'+replaceSuffix].apply(this, arguments);
	},

	/* Allow clone to correctly retrieve cached title attributes */
	clone: function(keepData) {
		var titles = $([]), title = 'title',

		// Clone our element using the real clone method
		elems = $.fn['clone'+replaceSuffix].apply(this, arguments);

		// Grab all elements with an oldtitle set, and change it to regular title attribute, if keepData is false
		if(!keepData) {
			elems.filter('['+oldtitle+']').attr('title', function() {
				return $.attr(this, oldtitle);
			})
			.removeAttr(oldtitle);
		}

		return elems;
	}
}, function(name, func) {
	if(!func || $.fn[name+replaceSuffix]) { return TRUE; }

	var old = $.fn[name+replaceSuffix] = $.fn[name];
	$.fn[name] = function() {
		return func.apply(this, arguments) || old.apply(this, arguments);
	};
});

/* Fire off 'removeqtip' handler in $.cleanData if jQuery UI not present (it already does similar).
 * This snippet is taken directly from jQuery UI source code found here:
 *     http://code.jquery.com/ui/jquery-ui-git.js
 */
if(!$.ui) {
	$['cleanData'+replaceSuffix] = $.cleanData;
	$.cleanData = function( elems ) {
		for(var i = 0, elem; (elem = $( elems[i] )).length; i++) {
			if(elem.attr(ATTR_HAS)) {
				try { elem.triggerHandler('removeqtip'); } 
				catch( e ) {}
			}
		}
		$['cleanData'+replaceSuffix].apply(this, arguments);
	};
}

;// qTip version
QTIP.version = '2.1.1';

// Base ID for all qTips
QTIP.nextid = 0;

// Inactive events array
QTIP.inactiveEvents = INACTIVE_EVENTS;

// Base z-index for all qTips
QTIP.zindex = 15000;

// Define configuration defaults
QTIP.defaults = {
	prerender: FALSE,
	id: FALSE,
	overwrite: TRUE,
	suppress: TRUE,
	content: {
		text: TRUE,
		attr: 'title',
		title: FALSE,
		button: FALSE
	},
	position: {
		my: 'top left',
		at: 'bottom right',
		target: FALSE,
		container: FALSE,
		viewport: FALSE,
		adjust: {
			x: 0, y: 0,
			mouse: TRUE,
			scroll: TRUE,
			resize: TRUE,
			method: 'flipinvert flipinvert'
		},
		effect: function(api, pos, viewport) {
			$(this).animate(pos, {
				duration: 200,
				queue: FALSE
			});
		}
	},
	show: {
		target: FALSE,
		event: 'mouseenter',
		effect: TRUE,
		delay: 90,
		solo: FALSE,
		ready: FALSE,
		autofocus: FALSE
	},
	hide: {
		target: FALSE,
		event: 'mouseleave',
		effect: TRUE,
		delay: 0,
		fixed: FALSE,
		inactive: FALSE,
		leave: 'window',
		distance: FALSE
	},
	style: {
		classes: '',
		widget: FALSE,
		width: FALSE,
		height: FALSE,
		def: TRUE
	},
	events: {
		render: NULL,
		move: NULL,
		show: NULL,
		hide: NULL,
		toggle: NULL,
		visible: NULL,
		hidden: NULL,
		focus: NULL,
		blur: NULL
	}
};

;var TIP,

// .bind()/.on() namespace
TIPNS = '.qtip-tip',

// Common CSS strings
MARGIN = 'margin',
BORDER = 'border',
COLOR = 'color',
BG_COLOR = 'background-color',
TRANSPARENT = 'transparent',
IMPORTANT = ' !important',

// Check if the browser supports <canvas/> elements
HASCANVAS = !!document.createElement('canvas').getContext,

// Invalid colour values used in parseColours()
INVALID = /rgba?\(0, 0, 0(, 0)?\)|transparent|#123456/i;

// Camel-case method, taken from jQuery source
// http://code.jquery.com/jquery-1.8.0.js
function camel(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

/*
 * Modified from Modernizr's testPropsAll()
 * http://modernizr.com/downloads/modernizr-latest.js
 */
var cssProps = {}, cssPrefixes = ["Webkit", "O", "Moz", "ms"];
function vendorCss(elem, prop) {
	var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1),
		props = (prop + ' ' + cssPrefixes.join(ucProp + ' ') + ucProp).split(' '),
		cur, val, i = 0;

	// If the property has already been mapped...
	if(cssProps[prop]) { return elem.css(cssProps[prop]); }

	while((cur = props[i++])) {
		if((val = elem.css(cur)) !== undefined) {
			return cssProps[prop] = cur, val;
		}
	}
}

// Parse a given elements CSS property into an int
function intCss(elem, prop) {
	return parseInt(vendorCss(elem, prop), 10);
}


// VML creation (for IE only)
if(!HASCANVAS) {
	createVML = function(tag, props, style) {
		return '<qtipvml:'+tag+' xmlns="urn:schemas-microsoft.com:vml" class="qtip-vml" '+(props||'')+
			' style="behavior: url(#default#VML); '+(style||'')+ '" />';
	};
}



function Tip(qtip, options) {
	this._ns = 'tip';
	this.options = options;
	this.offset = options.offset;
	this.size = [ options.width, options.height ];

	// Initialize
	this.init( (this.qtip = qtip) );
}

$.extend(Tip.prototype, {
	init: function(qtip) {
		var context, tip;

		// Create tip element and prepend to the tooltip
		tip = this.element = qtip.elements.tip = $('<div />', { 'class': NAMESPACE+'-tip' }).prependTo(qtip.tooltip);

		// Create tip drawing element(s)
		if(HASCANVAS) {
			// save() as soon as we create the canvas element so FF2 doesn't bork on our first restore()!
			context = $('<canvas />').appendTo(this.element)[0].getContext('2d');

			// Setup constant parameters
			context.lineJoin = 'miter';
			context.miterLimit = 100;
			context.save();
		}
		else {
			context = createVML('shape', 'coordorigin="0,0"', 'position:absolute;');
			this.element.html(context + context);

			// Prevent mousing down on the tip since it causes problems with .live() handling in IE due to VML
			qtip._bind( $('*', tip).add(tip), ['click', 'mousedown'], function(event) { event.stopPropagation(); }, this._ns);
		}

		// Bind update events
		qtip._bind(qtip.tooltip, 'tooltipmove', this.reposition, this._ns, this);

		// Create it
		this.create();
	},

	_swapDimensions: function() {
		this.size[0] = this.options.height;
		this.size[1] = this.options.width;
	},
	_resetDimensions: function() {
		this.size[0] = this.options.width;
		this.size[1] = this.options.height;
	},

	_useTitle: function(corner) {
		var titlebar = this.qtip.elements.titlebar;
		return titlebar && (
			corner.y === TOP || (corner.y === CENTER && this.element.position().top + (this.size[1] / 2) + this.options.offset < titlebar.outerHeight(TRUE))
		);
	},

	_parseCorner: function(corner) {
		var my = this.qtip.options.position.my;

		// Detect corner and mimic properties
		if(corner === FALSE || my === FALSE) {
			corner = FALSE;
		}
		else if(corner === TRUE) {
			corner = new CORNER( my.string() );
		}
		else if(!corner.string) {
			corner = new CORNER(corner);
			corner.fixed = TRUE;
		}

		return corner;
	},

	_parseWidth: function(corner, side, use) {
		var elements = this.qtip.elements,
			prop = BORDER + camel(side) + 'Width';

		return (use ? intCss(use, prop) : (
			intCss(elements.content, prop) ||
			intCss(this._useTitle(corner) && elements.titlebar || elements.content, prop) ||
			intCss(tooltip, prop)
		)) || 0;
	},

	_parseRadius: function(corner) {
		var elements = this.qtip.elements,
			prop = BORDER + camel(corner.y) + camel(corner.x) + 'Radius';

		return BROWSER.ie < 9 ? 0 :
			intCss(this._useTitle(corner) && elements.titlebar || elements.content, prop) || 
			intCss(elements.tooltip, prop) || 0;
	},

	_invalidColour: function(elem, prop, compare) {
		var val = elem.css(prop);
		return !val || (compare && val === elem.css(compare)) || INVALID.test(val) ? FALSE : val;
	},

	_parseColours: function(corner) {
		var elements = this.qtip.elements,
			tip = this.element.css('cssText', ''),
			borderSide = BORDER + camel(corner[ corner.precedance ]) + camel(COLOR),
			colorElem = this._useTitle(corner) && elements.titlebar || elements.content,
			css = this._invalidColour, color = [];

		// Attempt to detect the background colour from various elements, left-to-right precedance
		color[0] = css(tip, BG_COLOR) || css(colorElem, BG_COLOR) || css(elements.content, BG_COLOR) || 
			css(tooltip, BG_COLOR) || tip.css(BG_COLOR);

		// Attempt to detect the correct border side colour from various elements, left-to-right precedance
		color[1] = css(tip, borderSide, COLOR) || css(colorElem, borderSide, COLOR) || 
			css(elements.content, borderSide, COLOR) || css(tooltip, borderSide, COLOR) || tooltip.css(borderSide);

		// Reset background and border colours
		$('*', tip).add(tip).css('cssText', BG_COLOR+':'+TRANSPARENT+IMPORTANT+';'+BORDER+':0'+IMPORTANT+';');

		return color;
	},

	_calculateSize: function(corner) {
		var y = corner.precedance === Y,
			width = this.options[ y ? 'height' : 'width' ],
			height = this.options[ y ? 'width' : 'height' ],
			isCenter = corner.abbrev() === 'c',
			base = width * (isCenter ? 0.5 : 1),
			pow = Math.pow,
			round = Math.round,
			bigHyp, ratio, result,

		smallHyp = Math.sqrt( pow(base, 2) + pow(height, 2) ),
		hyp = [ (this.border / base) * smallHyp, (this.border / height) * smallHyp ];

		hyp[2] = Math.sqrt( pow(hyp[0], 2) - pow(this.border, 2) );
		hyp[3] = Math.sqrt( pow(hyp[1], 2) - pow(this.border, 2) );

		bigHyp = smallHyp + hyp[2] + hyp[3] + (isCenter ? 0 : hyp[0]);
		ratio = bigHyp / smallHyp;

		result = [ round(ratio * width), round(ratio * height) ];

		return y ? result : result.reverse();
	},

	// Tip coordinates calculator
	_calculateTip: function(corner) {	
		var width = this.size[0], height = this.size[1],
			width2 = Math.ceil(width / 2), height2 = Math.ceil(height / 2),

		// Define tip coordinates in terms of height and width values
		tips = {
			br:	[0,0,		width,height,	width,0],
			bl:	[0,0,		width,0,		0,height],
			tr:	[0,height,	width,0,		width,height],
			tl:	[0,0,		0,height,		width,height],
			tc:	[0,height,	width2,0,		width,height],
			bc:	[0,0,		width,0,		width2,height],
			rc:	[0,0,		width,height2,	0,height],
			lc:	[width,0,	width,height,	0,height2]
		};

		// Set common side shapes
		tips.lt = tips.br; tips.rt = tips.bl;
		tips.lb = tips.tr; tips.rb = tips.tl;

		return tips[ corner.abbrev() ];
	},

	create: function() {
		// Determine tip corner
		var c = this.corner = (HASCANVAS || BROWSER.ie) && this._parseCorner(this.options.corner);
		
		// If we have a tip corner...
		if( (this.enabled = !!this.corner && this.corner.abbrev() !== 'c') ) {
			// Cache it
			this.qtip.cache.corner = c.clone();

			// Create it
			this.update();
		}

		// Toggle tip element
		this.element.toggle(this.enabled);

		return this.corner;
	},

	update: function(corner, position) {
		if(!this.enabled) { return this; }

		var elements = this.qtip.elements,
			tip = this.element,
			inner = tip.children(),
			options = this.options,
			size = this.size,
			mimic = options.mimic,
			round = Math.round,
			color, precedance, context,
			coords, translate, newSize, border;

		// Re-determine tip if not already set
		if(!corner) { corner = this.qtip.cache.corner || this.corner; }

		// Use corner property if we detect an invalid mimic value
		if(mimic === FALSE) { mimic = corner; }

		// Otherwise inherit mimic properties from the corner object as necessary
		else {
			mimic = new CORNER(mimic);
			mimic.precedance = corner.precedance;

			if(mimic.x === 'inherit') { mimic.x = corner.x; }
			else if(mimic.y === 'inherit') { mimic.y = corner.y; }
			else if(mimic.x === mimic.y) {
				mimic[ corner.precedance ] = corner[ corner.precedance ];
			}
		}
		precedance = mimic.precedance;

		// Ensure the tip width.height are relative to the tip position
		if(corner.precedance === X) { this._swapDimensions(); }
		else { this._resetDimensions(); }

		// Update our colours
		color = this.color = this._parseColours(corner);

		// Detect border width, taking into account colours
		if(color[1] !== TRANSPARENT) {
			// Grab border width
			border = this.border = this._parseWidth(corner, corner[corner.precedance]);

			// If border width isn't zero, use border color as fill (1.0 style tips)
			if(options.border && border < 1) { color[0] = color[1]; }

			// Set border width (use detected border width if options.border is true)
			this.border = border = options.border !== TRUE ? options.border : border;
		}

		// Border colour was invalid, set border to zero
		else { this.border = border = 0; }

		// Calculate coordinates
		coords = this._calculateTip(mimic);

		// Determine tip size
		newSize = this.size = this._calculateSize(corner);
		tip.css({
			width: newSize[0],
			height: newSize[1],
			lineHeight: newSize[1]+'px'
		});

		// Calculate tip translation
		if(corner.precedance === Y) {
			translate = [
				round(mimic.x === LEFT ? border : mimic.x === RIGHT ? newSize[0] - size[0] - border : (newSize[0] - size[0]) / 2),
				round(mimic.y === TOP ? newSize[1] - size[1] : 0)
			];
		}
		else {
			translate = [
				round(mimic.x === LEFT ? newSize[0] - size[0] : 0),
				round(mimic.y === TOP ? border : mimic.y === BOTTOM ? newSize[1] - size[1] - border : (newSize[1] - size[1]) / 2)
			];
		}

		// Canvas drawing implementation
		if(HASCANVAS) {
			// Set the canvas size using calculated size
			inner.attr(WIDTH, newSize[0]).attr(HEIGHT, newSize[1]);

			// Grab canvas context and clear/save it
			context = inner[0].getContext('2d');
			context.restore(); context.save();
			context.clearRect(0,0,3000,3000);

			// Set properties
			context.fillStyle = color[0];
			context.strokeStyle = color[1];
			context.lineWidth = border * 2;

			// Draw the tip
			context.translate(translate[0], translate[1]);
			context.beginPath();
			context.moveTo(coords[0], coords[1]);
			context.lineTo(coords[2], coords[3]);
			context.lineTo(coords[4], coords[5]);
			context.closePath();

			// Apply fill and border
			if(border) {
				// Make sure transparent borders are supported by doing a stroke
				// of the background colour before the stroke colour
				if(tooltip.css('background-clip') === 'border-box') {
					context.strokeStyle = color[0];
					context.stroke();
				}
				context.strokeStyle = color[1];
				context.stroke();
			}
			context.fill();
		}

		// VML (IE Proprietary implementation)
		else {
			// Setup coordinates string
			coords = 'm' + coords[0] + ',' + coords[1] + ' l' + coords[2] +
				',' + coords[3] + ' ' + coords[4] + ',' + coords[5] + ' xe';

			// Setup VML-specific offset for pixel-perfection
			translate[2] = border && /^(r|b)/i.test(corner.string()) ? 
				BROWSER.ie === 8 ? 2 : 1 : 0;

			// Set initial CSS
			inner.css({
				coordsize: (size[0]+border) + ' ' + (size[1]+border),
				antialias: ''+(mimic.string().indexOf(CENTER) > -1),
				left: translate[0] - (translate[2] * Number(precedance === X)),
				top: translate[1] - (translate[2] * Number(precedance === Y)),
				width: size[0] + border,
				height: size[1] + border
			})
			.each(function(i) {
				var $this = $(this);

				// Set shape specific attributes
				$this[ $this.prop ? 'prop' : 'attr' ]({
					coordsize: (size[0]+border) + ' ' + (size[1]+border),
					path: coords,
					fillcolor: color[0],
					filled: !!i,
					stroked: !i
				})
				.toggle(!!(border || i));

				// Check if border is enabled and add stroke element
				!i && $this.html( createVML(
					'stroke', 'weight="'+(border*2)+'px" color="'+color[1]+'" miterlimit="1000" joinstyle="miter"'
				) );
			});
		}

		// Position if needed
		if(position !== FALSE) { this.calculate(corner); }
	},

	calculate: function(corner) {
		if(!this.enabled) { return FALSE; }

		var self = this,
			elements = this.qtip.elements,
			tip = this.element,
			userOffset = this.options.offset,
			isWidget = this.qtip.tooltip.hasClass('ui-widget'),
			position = {  },
			precedance, size, corners;

		// Inherit corner if not provided
		corner = corner || this.corner;
		precedance = corner.precedance;

		// Determine which tip dimension to use for adjustment
		size = this._calculateSize(corner);

		// Setup corners and offset array
		corners = [ corner.x, corner.y ];
		if(precedance === X) { corners.reverse(); }

		// Calculate tip position
		$.each(corners, function(i, side) {
			var b, bc, br;

			if(side === CENTER) {
				b = precedance === Y ? LEFT : TOP;
				position[ b ] = '50%';
				position[MARGIN+'-' + b] = -Math.round(size[ precedance === Y ? 0 : 1 ] / 2) + userOffset;
			}
			else {
				b = self._parseWidth(corner, side, elements.tooltip);
				bc = self._parseWidth(corner, side, elements.content);
				br = self._parseRadius(corner);

				position[ side ] = Math.max(-self.border, i ? bc : (userOffset + (br > b ? br : -b)));
			}
		});

		// Adjust for tip size
		position[ corner[precedance] ] -= size[ precedance === X ? 0 : 1 ];

		// Set and return new position
		tip.css({ margin: '', top: '', bottom: '', left: '', right: '' }).css(position);
		return position;
	},

	reposition: function(event, api, pos, viewport) {
		if(!this.enabled) { return; }

		var cache = api.cache,
			newCorner = this.corner.clone(),
			adjust = pos.adjusted,
			method = api.options.position.adjust.method.split(' '),
			horizontal = method[0],
			vertical = method[1] || method[0],
			shift = { left: FALSE, top: FALSE, x: 0, y: 0 },
			offset, css = {}, props;

		// If our tip position isn't fixed e.g. doesn't adjust with viewport...
		if(this.corner.fixed !== TRUE) {
			// Horizontal - Shift or flip method
			if(horizontal === SHIFT && newCorner.precedance === X && adjust.left && newCorner.y !== CENTER) {
				newCorner.precedance = newCorner.precedance === X ? Y : X;
			}
			else if(horizontal !== SHIFT && adjust.left){
				newCorner.x = newCorner.x === CENTER ? (adjust.left > 0 ? LEFT : RIGHT) : (newCorner.x === LEFT ? RIGHT : LEFT);
			}

			// Vertical - Shift or flip method
			if(vertical === SHIFT && newCorner.precedance === Y && adjust.top && newCorner.x !== CENTER) {
				newCorner.precedance = newCorner.precedance === Y ? X : Y;
			}
			else if(vertical !== SHIFT && adjust.top) {
				newCorner.y = newCorner.y === CENTER ? (adjust.top > 0 ? TOP : BOTTOM) : (newCorner.y === TOP ? BOTTOM : TOP);
			}

			// Update and redraw the tip if needed (check cached details of last drawn tip)
			if(newCorner.string() !== cache.corner.string() && (cache.cornerTop !== adjust.top || cache.cornerLeft !== adjust.left)) {
				this.update(newCorner, FALSE);
			}
		}

		// Setup tip offset properties
		offset = this.calculate(newCorner, adjust);

		// Readjust offset object to make it left/top
		if(offset.right !== undefined) { offset.left = -offset.right; }
		if(offset.bottom !== undefined) { offset.top = -offset.bottom; }
		offset.user = this.offset;

		// Viewport "shift" specific adjustments
		if(shift.left = (horizontal === SHIFT && !!adjust.left)) {
			if(newCorner.x === CENTER) {
				css[MARGIN+'-left'] = shift.x = offset[MARGIN+'-left'] - adjust.left;
			}
			else {
				props = offset.right !== undefined ?
					[ adjust.left, -offset.left ] : [ -adjust.left, offset.left ];

				if( (shift.x = Math.max(props[0], props[1])) > props[0] ) {
					pos.left -= adjust.left;
					shift.left = FALSE;
				}
				
				css[ offset.right !== undefined ? RIGHT : LEFT ] = shift.x;
			}
		}
		if(shift.top = (vertical === SHIFT && !!adjust.top)) {
			if(newCorner.y === CENTER) {
				css[MARGIN+'-top'] = shift.y = offset[MARGIN+'-top'] - adjust.top;
			}
			else {
				props = offset.bottom !== undefined ?
					[ adjust.top, -offset.top ] : [ -adjust.top, offset.top ];

				if( (shift.y = Math.max(props[0], props[1])) > props[0] ) {
					pos.top -= adjust.top;
					shift.top = FALSE;
				}

				css[ offset.bottom !== undefined ? BOTTOM : TOP ] = shift.y;
			}
		}

		/*
		* If the tip is adjusted in both dimensions, or in a
		* direction that would cause it to be anywhere but the
		* outer border, hide it!
		*/
		this.element.css(css).toggle(
			!((shift.x && shift.y) || (newCorner.x === CENTER && shift.y) || (newCorner.y === CENTER && shift.x))
		);

		// Adjust position to accomodate tip dimensions
		pos.left -= offset.left.charAt ? offset.user : horizontal !== SHIFT || shift.top || !shift.left && !shift.top ? offset.left : 0;
		pos.top -= offset.top.charAt ? offset.user : vertical !== SHIFT || shift.left || !shift.left && !shift.top ? offset.top : 0;

		// Cache details
		cache.cornerLeft = adjust.left; cache.cornerTop = adjust.top;
		cache.corner = newCorner.clone();
	},

	destroy: function() {
		// Unbind events
		this.qtip._unbind(this.qtip.tooltip, this._ns);

		// Remove the tip element(s)
		if(this.qtip.elements.tip) {
			this.qtip.elements.tip.find('*')
				.remove().end().remove();
		}
	}
});

TIP = PLUGINS.tip = function(api) {
	return new Tip(api, api.options.style.tip);
};

// Initialize tip on render
TIP.initialize = 'render';

// Setup plugin sanitization options
TIP.sanitize = function(options) {
	if(options.style && 'tip' in options.style) {
		opts = options.style.tip;
		if(typeof opts !== 'object') { opts = options.style.tip = { corner: opts }; }
		if(!(/string|boolean/i).test(typeof opts.corner)) { opts.corner = TRUE; }
	}
};

// Add new option checks for the plugin
CHECKS.tip = {
	'^position.my|style.tip.(corner|mimic|border)$': function() {
		// Make sure a tip can be drawn
		this.create();
		
		// Reposition the tooltip
		this.qtip.reposition();
	},
	'^style.tip.(height|width)$': function(obj) {
		// Re-set dimensions and redraw the tip
		this.size = size = [ obj.width, obj.height ];
		this.update();

		// Reposition the tooltip
		this.qtip.reposition();
	},
	'^content.title|style.(classes|widget)$': function() {
		this.update();
	}
};

// Extend original qTip defaults
$.extend(TRUE, QTIP.defaults, {
	style: {
		tip: {
			corner: TRUE,
			mimic: FALSE,
			width: 6,
			height: 6,
			border: TRUE,
			offset: 0
		}
	}
});

;}));
}( window, document ));


/** @license
 * Scroller
 * http://github.com/zynga/scroller
 *
 * Copyright 2011, Zynga Inc.
 * Licensed under the MIT License.
 * https://raw.github.com/zynga/scroller/master/MIT-LICENSE.txt
 *
 * Based on the work of: Unify Project (unify-project.org)
 * http://unify-project.org
 * Copyright 2011, Deutsche Telekom AG
 * License: MIT + Apache (V2)
 *
 * Inspired by: https://github.com/inexorabletash/raf-shim/blob/master/raf.js
 */
(function(global)
{
	if(global.requestAnimationFrame) {
		return;
	}

	// Basic emulation of native methods for internal use

	var now = Date.now || function() {
		return +new Date;
	};

	var getKeys = Object.keys || function(obj) {

		var keys = {};
		for (var key in obj) {
			keys[key] = true;
		}

		return keys;

	};

	var isEmpty = Object.empty || function(obj) {

		for (var key in obj) {
			return false;
		}

		return true;

	};


	// requestAnimationFrame polyfill
	// http://webstuff.nfshost.com/anim-timing/Overview.html

	var postfix = "RequestAnimationFrame";
	var prefix = (function()
	{
		var all = "webkit,moz,o,ms".split(",");
		for (var i=0; i<4; i++) {
			if (global[all[i]+postfix] != null) {
				return all[i];
			}
		}
	})();

	// Vendor specific implementation
	if (prefix)
	{
		global.requestAnimationFrame = global[prefix+postfix];
		global.cancelRequestAnimationFrame = global[prefix+"Cancel"+postfix];
		return;
	}

	// Custom implementation
	var TARGET_FPS = 60;
	var requests = {};
	var rafHandle = 1;
	var timeoutHandle = null;

	global.requestAnimationFrame = function(callback, root)
	{
		var callbackHandle = rafHandle++;

		// Store callback
		requests[callbackHandle] = callback;

		// Create timeout at first request
		if (timeoutHandle === null)
		{
			timeoutHandle = setTimeout(function()
			{
				var time = now();
				var currentRequests = requests;
				var keys = getKeys(currentRequests);

				// Reset data structure before executing callbacks
				requests = {};
				timeoutHandle = null;

				// Process all callbacks
				for (var i=0, l=keys.length; i<l; i++) {
					currentRequests[keys[i]](time);
				}
			}, 1000 / TARGET_FPS);
		}

		return callbackHandle;
	};

	global.cancelRequestAnimationFrame = function(handle)
	{
		delete requests[handle];

		// Stop timeout if all where removed
		if (isEmpty(requests))
		{
			clearTimeout(timeoutHandle);
			timeoutHandle = null;
		}
	};

})(this);/*
 * Scroller
 * http://github.com/zynga/scroller
 *
 * Copyright 2011, Zynga Inc.
 * Licensed under the MIT License.
 * https://raw.github.com/zynga/scroller/master/MIT-LICENSE.txt
 *
 * Based on the work of: Unify Project (unify-project.org)
 * http://unify-project.org
 * Copyright 2011, Deutsche Telekom AG
 * License: MIT + Apache (V2)
 */

/**
 * Generic animation class with support for dropped frames both optional easing and duration.
 *
 * Optional duration is useful when the lifetime is defined by another condition than time
 * e.g. speed of an animating object, etc.
 *
 * Dropped frame logic allows to keep using the same updater logic independent from the actual
 * rendering. This eases a lot of cases where it might be pretty complex to break down a state
 * based on the pure time difference.
 */
(function(global) {
	var time = Date.now || function() {
		return +new Date();
	};
	var desiredFrames = 60;
	var millisecondsPerSecond = 1000;
	var running = {};
	var counter = 1;

	// Create namespaces
	if (!global.core) {
		global.core = { effect : {} };
	} else if (!core.effect) {
		core.effect = {};
	}

	core.effect.Animate = {

		/**
		 * Stops the given animation.
		 *
		 * @param id {Integer} Unique animation ID
		 * @return {Boolean} Whether the animation was stopped (aka, was running before)
		 */
		stop: function(id) {
			var cleared = running[id] != null;
			if (cleared) {
				running[id] = null;
			}

			return cleared;
		},


		/**
		 * Whether the given animation is still running.
		 *
		 * @param id {Integer} Unique animation ID
		 * @return {Boolean} Whether the animation is still running
		 */
		isRunning: function(id) {
			return running[id] != null;
		},


		/**
		 * Start the animation.
		 *
		 * @param stepCallback {Function} Pointer to function which is executed on every step.
		 *   Signature of the method should be `function(percent, now, virtual) { return continueWithAnimation; }`
		 * @param verifyCallback {Function} Executed before every animation step.
		 *   Signature of the method should be `function() { return continueWithAnimation; }`
		 * @param completedCallback {Function}
		 *   Signature of the method should be `function(droppedFrames, finishedAnimation) {}`
		 * @param duration {Integer} Milliseconds to run the animation
		 * @param easingMethod {Function} Pointer to easing function
		 *   Signature of the method should be `function(percent) { return modifiedValue; }`
		 * @param root {Element ? document.body} Render root, when available. Used for internal
		 *   usage of requestAnimationFrame.
		 * @return {Integer} Identifier of animation. Can be used to stop it any time.
		 */
		start: function(stepCallback, verifyCallback, completedCallback, duration, easingMethod, root) {

			var start = time();
			var lastFrame = start;
			var percent = 0;
			var dropCounter = 0;
			var id = counter++;

			if (!root) {
				root = document.body;
			}

			// Compacting running db automatically every few new animations
			if (id % 20 === 0) {
				var newRunning = {};
				for (var usedId in running) {
					newRunning[usedId] = true;
				}
				running = newRunning;
			}

			// This is the internal step method which is called every few milliseconds
			var step = function(virtual) {

				// Normalize virtual value
				var render = virtual !== true;

				// Get current time
				var now = time();

				// Verification is executed before next animation step
				if (!running[id] || (verifyCallback && !verifyCallback(id))) {

					running[id] = null;
					completedCallback && completedCallback(desiredFrames - (dropCounter / ((now - start) / millisecondsPerSecond)), id, false);
					return;

				}

				// For the current rendering to apply let's update omitted steps in memory.
				// This is important to bring internal state variables up-to-date with progress in time.
				if (render) {

					var droppedFrames = Math.round((now - lastFrame) / (millisecondsPerSecond / desiredFrames)) - 1;
					for (var j = 0; j < Math.min(droppedFrames, 4); j++) {
						step(true);
						dropCounter++;
					}

				}

				// Compute percent value
				if (duration) {
					percent = (now - start) / duration;
					if (percent > 1) {
						percent = 1;
					}
				}

				// Execute step callback, then...
				var value = easingMethod ? easingMethod(percent) : percent;
				if ((stepCallback(value, now, render) === false || percent === 1) && render) {
					running[id] = null;
					completedCallback && completedCallback(desiredFrames - (dropCounter / ((now - start) / millisecondsPerSecond)), id, percent === 1 || duration == null);
				} else if (render) {
					lastFrame = now;
					requestAnimationFrame(step, root);
				}
			};

			// Mark as running
			running[id] = true;

			// Init first step
			requestAnimationFrame(step, root);

			// Return unique animation ID
			return id;
		}
	};
})(this);

var EasyScroller = function(content, options) {

	this.content = content;
	this.container = content.parentNode;
	this.options = options || {};

	// create Scroller instance
	var that = this;
	this.scroller = new Scroller(function(left, top, zoom) {
		that.render(left, top, zoom);
	}, options);

	// bind events
	this.bindEvents();

	// the content element needs a correct transform origin for zooming
	this.content.style[EasyScroller.vendorPrefix + 'TransformOrigin'] = "left top";

	// reflow for the first time
	this.reflow();

};

EasyScroller.prototype.render = (function() {

	var docStyle = document.documentElement.style;

	var engine;
	if (window.opera && Object.prototype.toString.call(opera) === '[object Opera]') {
		engine = 'presto';
	} else if ('MozAppearance' in docStyle) {
		engine = 'gecko';
	} else if ('WebkitAppearance' in docStyle) {
		engine = 'webkit';
	} else if (typeof navigator.cpuClass === 'string') {
		engine = 'trident';
	}

	var vendorPrefix = EasyScroller.vendorPrefix = {
		trident: 'ms',
		gecko: 'Moz',
		webkit: 'Webkit',
		presto: 'O'
	}[engine];

	var helperElem = document.createElement("div");
	var undef;

	var perspectiveProperty = vendorPrefix + "Perspective";
	var transformProperty = vendorPrefix + "Transform";

	if (helperElem.style[perspectiveProperty] !== undef) {

		return function(left, top, zoom) {
			this.content.style[transformProperty] = 'translate3d(' + (-left) + 'px,' + (-top) + 'px,0) scale(' + zoom + ')';
		};

	} else if (helperElem.style[transformProperty] !== undef) {

		return function(left, top, zoom) {
			this.content.style[transformProperty] = 'translate(' + (-left) + 'px,' + (-top) + 'px) scale(' + zoom + ')';
		};

	} else {

		return function(left, top, zoom) {
			this.content.style.marginLeft = left ? (-left/zoom) + 'px' : '';
			this.content.style.marginTop = top ? (-top/zoom) + 'px' : '';
			this.content.style.zoom = zoom || '';
		};

	}
})();

EasyScroller.prototype.reflow = function() {

	// set the right scroller dimensions
	this.scroller.setDimensions(this.container.clientWidth, this.container.clientHeight, this.content.offsetWidth, this.content.offsetHeight);

	// refresh the position for zooming purposes
	var rect = this.container.getBoundingClientRect();
	this.scroller.setPosition(rect.left + this.container.clientLeft, rect.top + this.container.clientTop);

};

EasyScroller.prototype.bindEvents = function() {

	var that = this;

	// reflow handling
	$(window).bind("resize", function() {
		that.reflow();
	});

  // added this here, not ideal, but it makes sure that the logo will
  // scroll correctly when the model tab is revealed.
  $('#modelTab').bind('click', function() {
		that.reflow();
  });


	// touch devices bind touch events
	if ('ontouchstart' in window) {

		this.container.addEventListener("touchstart", function(e) {

			// Don't react if initial down happens on a form element
			if (e.touches[0] && e.touches[0].target && e.touches[0].target.tagName.match(/input|textarea|select/i)) {
				return;
			}

			that.scroller.doTouchStart(e.touches, new Date().getTime());
			e.preventDefault();

		}, false);

		document.addEventListener("touchmove", function(e) {
			that.scroller.doTouchMove(e.touches, new Date().getTime(), e.scale);
		}, false);

		document.addEventListener("touchend", function(e) {
			that.scroller.doTouchEnd(new Date().getTime());
		}, false);

		document.addEventListener("touchcancel", function(e) {
			that.scroller.doTouchEnd(new Date().getTime());
		}, false);

	// non-touch bind mouse events
	} else {

		var mousedown = false;

		$(this.container).bind("mousedown", function(e) {

			if (e.target.tagName.match(/input|textarea|select/i)) {
				return;
			}


			that.scroller.doTouchStart([{
				pageX: e.pageX,
				pageY: e.pageY
			}], new Date().getTime());

			mousedown = true;
			e.preventDefault();

		});

		$(document).bind("mousemove", function(e) {

			if (!mousedown) {
				return;
			}

			that.scroller.doTouchMove([{
				pageX: e.pageX,
				pageY: e.pageY
			}], new Date().getTime());

			mousedown = true;

		});

		$(document).bind("mouseup", function(e) {

			if (!mousedown) {
				return;
			}

      that.scroller.doTouchEnd(new Date().getTime());

			mousedown = false;

		});

		$(this.container).bind("mousewheel", function(e) {
			if(that.options.zooming) {
				that.scroller.doMouseZoom(e.wheelDelta, new Date().getTime(), e.pageX, e.pageY);
				e.preventDefault();
			}
		});

	}

};

/*
 * Scroller
 * http://github.com/zynga/scroller
 *
 * Copyright 2011, Zynga Inc.
 * Licensed under the MIT License.
 * https://raw.github.com/zynga/scroller/master/MIT-LICENSE.txt
 *
 * Based on the work of: Unify Project (unify-project.org)
 * http://unify-project.org
 * Copyright 2011, Deutsche Telekom AG
 * License: MIT + Apache (V2)
 */

var Scroller;

(function() {

	/**
	 * A pure logic 'component' for 'virtual' scrolling/zooming.
	 */
	Scroller = function(callback, options) {

		this.__callback = callback;

		this.options = {

			/** Enable scrolling on x-axis */
			scrollingX: true,

			/** Enable scrolling on y-axis */
			scrollingY: true,

			/** Enable animations for deceleration, snap back, zooming and scrolling */
			animating: true,

			/** Enable bouncing (content can be slowly moved outside and jumps back after releasing) */
			bouncing: true,

			/** Enable locking to the main axis if user moves only slightly on one of them at start */
			locking: true,

			/** Enable pagination mode (switching between full page content panes) */
			paging: false,

			/** Enable snapping of content to a configured pixel grid */
			snapping: false,

			/** Enable zooming of content via API, fingers and mouse wheel */
			zooming: false,

			/** Minimum zoom level */
			minZoom: 0.5,

			/** Maximum zoom level */
			maxZoom: 3,

      /** event target **/
      eventTarget: null

		};

		for (var key in options) {
			this.options[key] = options[key];
		}

	};


	// Easing Equations (c) 2003 Robert Penner, all rights reserved.
	// Open source under the BSD License.

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	var easeOutCubic = function(pos) {
		return (Math.pow((pos - 1), 3) + 1);
	};

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	var easeInOutCubic = function(pos) {
		if ((pos /= 0.5) < 1) {
			return 0.5 * Math.pow(pos, 3);
		}

		return 0.5 * (Math.pow((pos - 2), 3) + 2);
	};


	var members = {

		/*
		---------------------------------------------------------------------------
			INTERNAL FIELDS :: STATUS
		---------------------------------------------------------------------------
		*/

		/** {Boolean} Whether only a single finger is used in touch handling */
		__isSingleTouch: false,

		/** {Boolean} Whether a touch event sequence is in progress */
		__isTracking: false,

		/**
		 * {Boolean} Whether a gesture zoom/rotate event is in progress. Activates when
		 * a gesturestart event happens. This has higher priority than dragging.
		 */
		__isGesturing: false,

		/**
		 * {Boolean} Whether the user has moved by such a distance that we have enabled
		 * dragging mode. Hint: It's only enabled after some pixels of movement to
		 * not interrupt with clicks etc.
		 */
		__isDragging: false,

		/**
		 * {Boolean} Not touching and dragging anymore, and smoothly animating the
		 * touch sequence using deceleration.
		 */
		__isDecelerating: false,

		/**
		 * {Boolean} Smoothly animating the currently configured change
		 */
		__isAnimating: false,



		/*
		---------------------------------------------------------------------------
			INTERNAL FIELDS :: DIMENSIONS
		---------------------------------------------------------------------------
		*/

		/** {Integer} Available outer left position (from document perspective) */
		__clientLeft: 0,

		/** {Integer} Available outer top position (from document perspective) */
		__clientTop: 0,

		/** {Integer} Available outer width */
		__clientWidth: 0,

		/** {Integer} Available outer height */
		__clientHeight: 0,

		/** {Integer} Outer width of content */
		__contentWidth: 0,

		/** {Integer} Outer height of content */
		__contentHeight: 0,

		/** {Integer} Snapping width for content */
		__snapWidth: 100,

		/** {Integer} Snapping height for content */
		__snapHeight: 100,

		/** {Integer} Height to assign to refresh area */
		__refreshHeight: null,

		/** {Boolean} Whether the refresh process is enabled when the event is released now */
		__refreshActive: false,

		/** {Function} Callback to execute on activation. This is for signalling the user about a refresh is about to happen when he release */
		__refreshActivate: null,

		/** {Function} Callback to execute on deactivation. This is for signalling the user about the refresh being cancelled */
		__refreshDeactivate: null,

		/** {Function} Callback to execute to start the actual refresh. Call {@link #refreshFinish} when done */
		__refreshStart: null,

		/** {Number} Zoom level */
		__zoomLevel: 1,

		/** {Number} Scroll position on x-axis */
		__scrollLeft: 0,

		/** {Number} Scroll position on y-axis */
		__scrollTop: 0,

		/** {Integer} Maximum allowed scroll position on x-axis */
		__maxScrollLeft: 0,

		/** {Integer} Maximum allowed scroll position on y-axis */
		__maxScrollTop: 0,

		/* {Number} Scheduled left position (final position when animating) */
		__scheduledLeft: 0,

		/* {Number} Scheduled top position (final position when animating) */
		__scheduledTop: 0,

		/* {Number} Scheduled zoom level (final scale when animating) */
		__scheduledZoom: 0,



		/*
		---------------------------------------------------------------------------
			INTERNAL FIELDS :: LAST POSITIONS
		---------------------------------------------------------------------------
		*/

		/** {Number} Left position of finger at start */
		__lastTouchLeft: null,

		/** {Number} Top position of finger at start */
		__lastTouchTop: null,

		/** {Date} Timestamp of last move of finger. Used to limit tracking range for deceleration speed. */
		__lastTouchMove: null,

		/** {Array} List of positions, uses three indexes for each state: left, top, timestamp */
		__positions: null,



		/*
		---------------------------------------------------------------------------
			INTERNAL FIELDS :: DECELERATION SUPPORT
		---------------------------------------------------------------------------
		*/

		/** {Integer} Minimum left scroll position during deceleration */
		__minDecelerationScrollLeft: null,

		/** {Integer} Minimum top scroll position during deceleration */
		__minDecelerationScrollTop: null,

		/** {Integer} Maximum left scroll position during deceleration */
		__maxDecelerationScrollLeft: null,

		/** {Integer} Maximum top scroll position during deceleration */
		__maxDecelerationScrollTop: null,

		/** {Number} Current factor to modify horizontal scroll position with on every step */
		__decelerationVelocityX: null,

		/** {Number} Current factor to modify vertical scroll position with on every step */
		__decelerationVelocityY: null,



		/*
		---------------------------------------------------------------------------
			PUBLIC API
		---------------------------------------------------------------------------
		*/

		/**
		 * Configures the dimensions of the client (outer) and content (inner) elements.
		 * Requires the available space for the outer element and the outer size of the inner element.
		 * All values which are falsy (null or zero etc.) are ignored and the old value is kept.
		 *
		 * @param clientWidth {Integer ? null} Inner width of outer element
		 * @param clientHeight {Integer ? null} Inner height of outer element
		 * @param contentWidth {Integer ? null} Outer width of inner element
		 * @param contentHeight {Integer ? null} Outer height of inner element
		 */
		setDimensions: function(clientWidth, clientHeight, contentWidth, contentHeight) {

			var self = this;

			// Only update values which are defined
			if (clientWidth) {
				self.__clientWidth = clientWidth;
			}

			if (clientHeight) {
				self.__clientHeight = clientHeight;
			}

			if (contentWidth) {
				self.__contentWidth = contentWidth;
			}

			if (contentHeight) {
				self.__contentHeight = contentHeight;
			}

			// Refresh maximums
			self.__computeScrollMax();

			// Refresh scroll position
			self.scrollTo(self.__scrollLeft, self.__scrollTop, true);

		},


		/**
		 * Sets the client coordinates in relation to the document.
		 *
		 * @param left {Integer ? 0} Left position of outer element
		 * @param top {Integer ? 0} Top position of outer element
		 */
		setPosition: function(left, top) {

			var self = this;

			self.__clientLeft = left || 0;
			self.__clientTop = top || 0;

		},


		/**
		 * Configures the snapping (when snapping is active)
		 *
		 * @param width {Integer} Snapping width
		 * @param height {Integer} Snapping height
		 */
		setSnapSize: function(width, height) {

			var self = this;

			self.__snapWidth = width;
			self.__snapHeight = height;

		},


		/**
		 * Activates pull-to-refresh. A special zone on the top of the list to start a list refresh whenever
		 * the user event is released during visibility of this zone. This was introduced by some apps on iOS like
		 * the official Twitter client.
		 *
		 * @param height {Integer} Height of pull-to-refresh zone on top of rendered list
		 * @param activateCallback {Function} Callback to execute on activation. This is for signalling the user about a refresh is about to happen when he release.
		 * @param deactivateCallback {Function} Callback to execute on deactivation. This is for signalling the user about the refresh being cancelled.
		 * @param startCallback {Function} Callback to execute to start the real async refresh action. Call {@link #finishPullToRefresh} after finish of refresh.
		 */
		activatePullToRefresh: function(height, activateCallback, deactivateCallback, startCallback) {

			var self = this;

			self.__refreshHeight = height;
			self.__refreshActivate = activateCallback;
			self.__refreshDeactivate = deactivateCallback;
			self.__refreshStart = startCallback;

		},


		/**
		 * Signalizes that pull-to-refresh is finished.
		 */
		finishPullToRefresh: function() {

			var self = this;

			self.__refreshActive = false;
			if (self.__refreshDeactivate) {
				self.__refreshDeactivate();
			}

			self.scrollTo(self.__scrollLeft, self.__scrollTop, true);

		},


		/**
		 * Returns the scroll position and zooming values
		 *
		 * @return {Map} `left` and `top` scroll position and `zoom` level
		 */
		getValues: function() {

			var self = this;

			return {
				left: self.__scrollLeft,
				top: self.__scrollTop,
				zoom: self.__zoomLevel
			};

		},


		/**
		 * Returns the maximum scroll values
		 *
		 * @return {Map} `left` and `top` maximum scroll values
		 */
		getScrollMax: function() {

			var self = this;

			return {
				left: self.__maxScrollLeft,
				top: self.__maxScrollTop
			};

		},


		/**
		 * Zooms to the given level. Supports optional animation. Zooms
		 * the center when no coordinates are given.
		 *
		 * @param level {Number} Level to zoom to
		 * @param animate {Boolean ? false} Whether to use animation
		 * @param originLeft {Number ? null} Zoom in at given left coordinate
		 * @param originTop {Number ? null} Zoom in at given top coordinate
		 */
		zoomTo: function(level, animate, originLeft, originTop) {

			var self = this;

			if (!self.options.zooming) {
				throw new Error("Zooming is not enabled!");
			}

			// Stop deceleration
			if (self.__isDecelerating) {
				core.effect.Animate.stop(self.__isDecelerating);
				self.__isDecelerating = false;
			}

			var oldLevel = self.__zoomLevel;

			// Normalize input origin to center of viewport if not defined
			if (originLeft == null) {
				originLeft = self.__clientWidth / 2;
			}

			if (originTop == null) {
				originTop = self.__clientHeight / 2;
			}

			// Limit level according to configuration
			level = Math.max(Math.min(level, self.options.maxZoom), self.options.minZoom);

			// Recompute maximum values while temporary tweaking maximum scroll ranges
			self.__computeScrollMax(level);

			// Recompute left and top coordinates based on new zoom level
			var left = ((originLeft + self.__scrollLeft) * level / oldLevel) - originLeft;
			var top = ((originTop + self.__scrollTop) * level / oldLevel) - originTop;

			// Limit x-axis
			if (left > self.__maxScrollLeft) {
				left = self.__maxScrollLeft;
			} else if (left < 0) {
				left = 0;
			}

			// Limit y-axis
			if (top > self.__maxScrollTop) {
				top = self.__maxScrollTop;
			} else if (top < 0) {
				top = 0;
			}

			// Push values out
			self.__publish(left, top, level, animate);

		},


		/**
		 * Zooms the content by the given factor.
		 *
		 * @param factor {Number} Zoom by given factor
		 * @param animate {Boolean ? false} Whether to use animation
		 * @param originLeft {Number ? 0} Zoom in at given left coordinate
		 * @param originTop {Number ? 0} Zoom in at given top coordinate
		 */
		zoomBy: function(factor, animate, originLeft, originTop) {

			var self = this;

			self.zoomTo(self.__zoomLevel * factor, animate, originLeft, originTop);

		},


		/**
		 * Scrolls to the given position. Respect limitations and snapping automatically.
		 *
		 * @param left {Number?null} Horizontal scroll position, keeps current if value is <code>null</code>
		 * @param top {Number?null} Vertical scroll position, keeps current if value is <code>null</code>
		 * @param animate {Boolean?false} Whether the scrolling should happen using an animation
		 * @param zoom {Number?null} Zoom level to go to
		 */
		scrollTo: function(left, top, animate, zoom) {

      $(document).trigger(this.options.eventTarget.attr('id') +  ".scrolledTo", [left, top, zoom] );

			var self = this;

			// Stop deceleration
			if (self.__isDecelerating) {
				core.effect.Animate.stop(self.__isDecelerating);
				self.__isDecelerating = false;
			}

			// Correct coordinates based on new zoom level
			if (zoom != null && zoom !== self.__zoomLevel) {

				if (!self.options.zooming) {
					throw new Error("Zooming is not enabled!");
				}

				left *= zoom;
				top *= zoom;

				// Recompute maximum values while temporary tweaking maximum scroll ranges
				self.__computeScrollMax(zoom);

			} else {

				// Keep zoom when not defined
				zoom = self.__zoomLevel;

			}

			if (!self.options.scrollingX) {

				left = self.__scrollLeft;

			} else {

				if (self.options.paging) {
					left = Math.round(left / self.__clientWidth) * self.__clientWidth;
				} else if (self.options.snapping) {
					left = Math.round(left / self.__snapWidth) * self.__snapWidth;
				}

			}

			if (!self.options.scrollingY) {

				top = self.__scrollTop;

			} else {

				if (self.options.paging) {
					top = Math.round(top / self.__clientHeight) * self.__clientHeight;
				} else if (self.options.snapping) {
					top = Math.round(top / self.__snapHeight) * self.__snapHeight;
				}

			}

			// Limit for allowed ranges
			left = Math.max(Math.min(self.__maxScrollLeft, left), 0);
			top = Math.max(Math.min(self.__maxScrollTop, top), 0);

			// Don't animate when no change detected, still call publish to make sure
			// that rendered position is really in-sync with internal data
			if (left === self.__scrollLeft && top === self.__scrollTop) {
				animate = false;
			}

			// Publish new values
			self.__publish(left, top, zoom, animate);

		},


		/**
		 * Scroll by the given offset
		 *
		 * @param left {Number ? 0} Scroll x-axis by given offset
		 * @param top {Number ? 0} Scroll x-axis by given offset
		 * @param animate {Boolean ? false} Whether to animate the given change
		 */
		scrollBy: function(left, top, animate) {

			var self = this;

			var startLeft = self.__isAnimating ? self.__scheduledLeft : self.__scrollLeft;
			var startTop = self.__isAnimating ? self.__scheduledTop : self.__scrollTop;

			self.scrollTo(startLeft + (left || 0), startTop + (top || 0), animate);

		},



		/*
		---------------------------------------------------------------------------
			EVENT CALLBACKS
		---------------------------------------------------------------------------
		*/

		/**
		 * Mouse wheel handler for zooming support
		 */
		doMouseZoom: function(wheelDelta, timeStamp, pageX, pageY) {

			var self = this;
			var change = wheelDelta > 0 ? 0.97 : 1.03;

			return self.zoomTo(self.__zoomLevel * change, false, pageX - self.__clientLeft, pageY - self.__clientTop);

		},


		/**
		 * Touch start handler for scrolling support
		 */
		doTouchStart: function(touches, timeStamp) {

			// Array-like check is enough here
			if (touches.length == null) {
				throw new Error("Invalid touch list: " + touches);
			}

			if (timeStamp instanceof Date) {
				timeStamp = timeStamp.valueOf();
			}
			if (typeof timeStamp !== "number") {
				throw new Error("Invalid timestamp value: " + timeStamp);
			}

			var self = this;

			// Stop deceleration
			if (self.__isDecelerating) {
				core.effect.Animate.stop(self.__isDecelerating);
				self.__isDecelerating = false;
			}

			// Stop animation
			if (self.__isAnimating) {
				core.effect.Animate.stop(self.__isAnimating);
				self.__isAnimating = false;
			}

			// Use center point when dealing with two fingers
			var currentTouchLeft, currentTouchTop;
			var isSingleTouch = touches.length === 1;
			if (isSingleTouch) {
				currentTouchLeft = touches[0].pageX;
				currentTouchTop = touches[0].pageY;
			} else {
				currentTouchLeft = Math.abs(touches[0].pageX + touches[1].pageX) / 2;
				currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2;
			}

			// Store initial positions
			self.__initialTouchLeft = currentTouchLeft;
			self.__initialTouchTop = currentTouchTop;

			// Store current zoom level
			self.__zoomLevelStart = self.__zoomLevel;

			// Store initial touch positions
			self.__lastTouchLeft = currentTouchLeft;
			self.__lastTouchTop = currentTouchTop;

			// Store initial move time stamp
			self.__lastTouchMove = timeStamp;

			// Reset initial scale
			self.__lastScale = 1;

			// Reset locking flags
			self.__enableScrollX = !isSingleTouch && self.options.scrollingX;
			self.__enableScrollY = !isSingleTouch && self.options.scrollingY;

			// Reset tracking flag
			self.__isTracking = true;

			// Dragging starts directly with two fingers, otherwise lazy with an offset
			self.__isDragging = !isSingleTouch;

			// Some features are disabled in multi touch scenarios
			self.__isSingleTouch = isSingleTouch;

			// Clearing data structure
			self.__positions = [];

		},


		/**
		 * Touch move handler for scrolling support
		 */
		doTouchMove: function(touches, timeStamp, scale) {

			// Array-like check is enough here
			if (touches.length == null) {
				throw new Error("Invalid touch list: " + touches);
			}

			if (timeStamp instanceof Date) {
				timeStamp = timeStamp.valueOf();
			}
			if (typeof timeStamp !== "number") {
				throw new Error("Invalid timestamp value: " + timeStamp);
			}

			var self = this;

			// Ignore event when tracking is not enabled (event might be outside of element)
			if (!self.__isTracking) {
				return;
			}


			var currentTouchLeft, currentTouchTop;

			// Compute move based around of center of fingers
			if (touches.length === 2) {
				currentTouchLeft = Math.abs(touches[0].pageX + touches[1].pageX) / 2;
				currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2;
			} else {
				currentTouchLeft = touches[0].pageX;
				currentTouchTop = touches[0].pageY;
			}

			var positions = self.__positions;

			// Are we already in dragging mode?
			if (self.__isDragging) {

				// Compute move distance
				var moveX = currentTouchLeft - self.__lastTouchLeft;
				var moveY = currentTouchTop - self.__lastTouchTop;

				// Read previous scroll position and zooming
				var scrollLeft = self.__scrollLeft;
				var scrollTop = self.__scrollTop;
				var level = self.__zoomLevel;

				// Work with scaling
				if (scale != null && self.options.zooming) {

					var oldLevel = level;

					// Recompute level based on previous scale and new scale
					level = level / self.__lastScale * scale;

					// Limit level according to configuration
					level = Math.max(Math.min(level, self.options.maxZoom), self.options.minZoom);

					// Only do further compution when change happened
					if (oldLevel !== level) {

						// Compute relative event position to container
						var currentTouchLeftRel = currentTouchLeft - self.__clientLeft;
						var currentTouchTopRel = currentTouchTop - self.__clientTop;

						// Recompute left and top coordinates based on new zoom level
						scrollLeft = ((currentTouchLeftRel + scrollLeft) * level / oldLevel) - currentTouchLeftRel;
						scrollTop = ((currentTouchTopRel + scrollTop) * level / oldLevel) - currentTouchTopRel;

						// Recompute max scroll values
						self.__computeScrollMax(level);

					}
				}

				if (self.__enableScrollX) {

					scrollLeft -= moveX;
					var maxScrollLeft = self.__maxScrollLeft;

					if (scrollLeft > maxScrollLeft || scrollLeft < 0) {

						// Slow down on the edges
						if (self.options.bouncing) {

							scrollLeft += (moveX / 2);

						} else if (scrollLeft > maxScrollLeft) {

							scrollLeft = maxScrollLeft;

						} else {

							scrollLeft = 0;

						}
					}
				}

				// Compute new vertical scroll position
				if (self.__enableScrollY) {

					scrollTop -= moveY;
					var maxScrollTop = self.__maxScrollTop;

					if (scrollTop > maxScrollTop || scrollTop < 0) {

						// Slow down on the edges
						if (self.options.bouncing) {

							scrollTop += (moveY / 2);

							// Support pull-to-refresh (only when only y is scrollable)
							if (!self.__enableScrollX && self.__refreshHeight != null) {

								if (!self.__refreshActive && scrollTop <= -self.__refreshHeight) {

									self.__refreshActive = true;
									if (self.__refreshActivate) {
										self.__refreshActivate();
									}

								} else if (self.__refreshActive && scrollTop > -self.__refreshHeight) {

									self.__refreshActive = false;
									if (self.__refreshDeactivate) {
										self.__refreshDeactivate();
									}

								}
							}

						} else if (scrollTop > maxScrollTop) {

							scrollTop = maxScrollTop;

						} else {

							scrollTop = 0;

						}
					}
				}

				// Keep list from growing infinitely (holding min 10, max 20 measure points)
				if (positions.length > 60) {
					positions.splice(0, 30);
				}

				// Track scroll movement for decleration
				positions.push(scrollLeft, scrollTop, timeStamp);

				// Sync scroll position
				self.__publish(scrollLeft, scrollTop, level);

			// Otherwise figure out whether we are switching into dragging mode now.
			} else {

				var minimumTrackingForScroll = self.options.locking ? 3 : 0;
				var minimumTrackingForDrag = 5;

				var distanceX = Math.abs(currentTouchLeft - self.__initialTouchLeft);
				var distanceY = Math.abs(currentTouchTop - self.__initialTouchTop);

				self.__enableScrollX = self.options.scrollingX && distanceX >= minimumTrackingForScroll;
				self.__enableScrollY = self.options.scrollingY && distanceY >= minimumTrackingForScroll;

				positions.push(self.__scrollLeft, self.__scrollTop, timeStamp);

				self.__isDragging = (self.__enableScrollX || self.__enableScrollY) && (distanceX >= minimumTrackingForDrag || distanceY >= minimumTrackingForDrag);

			}

			// Update last touch positions and time stamp for next event
			self.__lastTouchLeft = currentTouchLeft;
			self.__lastTouchTop = currentTouchTop;
			self.__lastTouchMove = timeStamp;
			self.__lastScale = scale;

		},


		/**
		 * Touch end handler for scrolling support
		 */
		doTouchEnd: function(timeStamp) {

			if (timeStamp instanceof Date) {
				timeStamp = timeStamp.valueOf();
			}
			if (typeof timeStamp !== "number") {
				throw new Error("Invalid timestamp value: " + timeStamp);
			}

			var self = this;

			// Ignore event when tracking is not enabled (no touchstart event on element)
			// This is required as this listener ('touchmove') sits on the document and not on the element itself.
			if (!self.__isTracking) {
				return;
			}

			// Not touching anymore (when two finger hit the screen there are two touch end events)
			self.__isTracking = false;

			// Be sure to reset the dragging flag now. Here we also detect whether
			// the finger has moved fast enough to switch into a deceleration animation.
			if (self.__isDragging) {

				// Reset dragging flag
				self.__isDragging = false;

				// Start deceleration
				// Verify that the last move detected was in some relevant time frame
				if (self.__isSingleTouch && self.options.animating && (timeStamp - self.__lastTouchMove) <= 100) {

					// Then figure out what the scroll position was about 100ms ago
					var positions = self.__positions;
					var endPos = positions.length - 1;
					var startPos = endPos;

					// Move pointer to position measured 100ms ago
					for (var i = endPos; i > 0 && positions[i] > (self.__lastTouchMove - 100); i -= 3) {
						startPos = i;
					}

					// If start and stop position is identical in a 100ms timeframe,
					// we cannot compute any useful deceleration.
					if (startPos !== endPos) {

						// Compute relative movement between these two points
						var timeOffset = positions[endPos] - positions[startPos];
						var movedLeft = self.__scrollLeft - positions[startPos - 2];
						var movedTop = self.__scrollTop - positions[startPos - 1];

						// Based on 50ms compute the movement to apply for each render step
						self.__decelerationVelocityX = movedLeft / timeOffset * (1000 / 60);
						self.__decelerationVelocityY = movedTop / timeOffset * (1000 / 60);

						// How much velocity is required to start the deceleration
						var minVelocityToStartDeceleration = self.options.paging || self.options.snapping ? 4 : 1;

						// Verify that we have enough velocity to start deceleration
						if (Math.abs(self.__decelerationVelocityX) > minVelocityToStartDeceleration || Math.abs(self.__decelerationVelocityY) > minVelocityToStartDeceleration) {

							// Deactivate pull-to-refresh when decelerating
							if (!self.__refreshActive) {

								self.__startDeceleration(timeStamp);

							}
						}
					}
				}
			}

			// If this was a slower move it is per default non decelerated, but this
			// still means that we want snap back to the bounds which is done here.
			// This is placed outside the condition above to improve edge case stability
			// e.g. touchend fired without enabled dragging. This should normally do not
			// have modified the scroll positions or even showed the scrollbars though.
			if (!self.__isDecelerating) {

				if (self.__refreshActive && self.__refreshStart) {

					// Use publish instead of scrollTo to allow scrolling to out of boundary position
					// We don't need to normalize scrollLeft, zoomLevel, etc. here because we only y-scrolling when pull-to-refresh is enabled
					self.__publish(self.__scrollLeft, -self.__refreshHeight, self.__zoomLevel, true);

					if (self.__refreshStart) {
						self.__refreshStart();
					}

				} else {

					self.scrollTo(self.__scrollLeft, self.__scrollTop, true, self.__zoomLevel);

					// Directly signalize deactivation (nothing todo on refresh?)
					if (self.__refreshActive) {

						self.__refreshActive = false;
						if (self.__refreshDeactivate) {
							self.__refreshDeactivate();
						}

					}
				}
			}

			// Fully cleanup list
			self.__positions.length = 0;

		},



		/*
		---------------------------------------------------------------------------
			PRIVATE API
		---------------------------------------------------------------------------
		*/

		/**
		 * Applies the scroll position to the content element
		 *
		 * @param left {Number} Left scroll position
		 * @param top {Number} Top scroll position
		 * @param animate {Boolean?false} Whether animation should be used to move to the new coordinates
		 */
		__publish: function(left, top, zoom, animate) {

			var self = this;

			// Remember whether we had an animation, then we try to continue based on the current "drive" of the animation
			var wasAnimating = self.__isAnimating;
			if (wasAnimating) {
				core.effect.Animate.stop(wasAnimating);
				self.__isAnimating = false;
			}

			if (animate && self.options.animating) {

				// Keep scheduled positions for scrollBy/zoomBy functionality
				self.__scheduledLeft = left;
				self.__scheduledTop = top;
				self.__scheduledZoom = zoom;

				var oldLeft = self.__scrollLeft;
				var oldTop = self.__scrollTop;
				var oldZoom = self.__zoomLevel;

				var diffLeft = left - oldLeft;
				var diffTop = top - oldTop;
				var diffZoom = zoom - oldZoom;

				var step = function(percent, now, render) {

					if (render) {

						self.__scrollLeft = oldLeft + (diffLeft * percent);
						self.__scrollTop = oldTop + (diffTop * percent);
						self.__zoomLevel = oldZoom + (diffZoom * percent);

						// Push values out
						if (self.__callback) {
							self.__callback(self.__scrollLeft, self.__scrollTop, self.__zoomLevel);
						}

					}
				};

				var verify = function(id) {
					return self.__isAnimating === id;
				};

				var completed = function(renderedFramesPerSecond, animationId, wasFinished) {
					if (animationId === self.__isAnimating) {
						self.__isAnimating = false;
					}

					if (self.options.zooming) {
						self.__computeScrollMax();
					}
				};

				// When continuing based on previous animation we choose an ease-out animation instead of ease-in-out
				self.__isAnimating = core.effect.Animate.start(step, verify, completed, 250, wasAnimating ? easeOutCubic : easeInOutCubic);

			} else {

				self.__scheduledLeft = self.__scrollLeft = left;
				self.__scheduledTop = self.__scrollTop = top;
				self.__scheduledZoom = self.__zoomLevel = zoom;

				// Push values out
				if (self.__callback) {
					self.__callback(left, top, zoom);
				}

				// Fix max scroll ranges
				if (self.options.zooming) {
					self.__computeScrollMax();
				}
			}
		},


		/**
		 * Recomputes scroll minimum values based on client dimensions and content dimensions.
		 */
		__computeScrollMax: function(zoomLevel) {

			var self = this;

			if (zoomLevel == null) {
				zoomLevel = self.__zoomLevel;
			}

			self.__maxScrollLeft = Math.max((self.__contentWidth * zoomLevel) - self.__clientWidth, 0);
			self.__maxScrollTop = Math.max((self.__contentHeight * zoomLevel) - self.__clientHeight, 0);

		},



		/*
		---------------------------------------------------------------------------
			ANIMATION (DECELERATION) SUPPORT
		---------------------------------------------------------------------------
		*/

		/**
		 * Called when a touch sequence end and the speed of the finger was high enough
		 * to switch into deceleration mode.
		 */
		__startDeceleration: function(timeStamp) {

			var self = this;

			if (self.options.paging) {

				var scrollLeft = Math.max(Math.min(self.__scrollLeft, self.__maxScrollLeft), 0);
				var scrollTop = Math.max(Math.min(self.__scrollTop, self.__maxScrollTop), 0);
				var clientWidth = self.__clientWidth;
				var clientHeight = self.__clientHeight;

				// We limit deceleration not to the min/max values of the allowed range, but to the size of the visible client area.
				// Each page should have exactly the size of the client area.
				self.__minDecelerationScrollLeft = Math.floor(scrollLeft / clientWidth) * clientWidth;
				self.__minDecelerationScrollTop = Math.floor(scrollTop / clientHeight) * clientHeight;
				self.__maxDecelerationScrollLeft = Math.ceil(scrollLeft / clientWidth) * clientWidth;
				self.__maxDecelerationScrollTop = Math.ceil(scrollTop / clientHeight) * clientHeight;

			} else {

				self.__minDecelerationScrollLeft = 0;
				self.__minDecelerationScrollTop = 0;
				self.__maxDecelerationScrollLeft = self.__maxScrollLeft;
				self.__maxDecelerationScrollTop = self.__maxScrollTop;

			}

			// Wrap class method
			var step = function(percent, now, render) {
				self.__stepThroughDeceleration(render);
			};

			// How much velocity is required to keep the deceleration running
			var minVelocityToKeepDecelerating = self.options.snapping ? 4 : 0.1;

			// Detect whether it's still worth to continue animating steps
			// If we are already slow enough to not being user perceivable anymore, we stop the whole process here.
			var verify = function() {
				return Math.abs(self.__decelerationVelocityX) >= minVelocityToKeepDecelerating || Math.abs(self.__decelerationVelocityY) >= minVelocityToKeepDecelerating;
			};

			var completed = function(renderedFramesPerSecond, animationId, wasFinished) {
				self.__isDecelerating = false;

				// Animate to grid when snapping is active, otherwise just fix out-of-boundary positions
				self.scrollTo(self.__scrollLeft, self.__scrollTop, self.options.snapping);
			};

			// Start animation and switch on flag
			self.__isDecelerating = core.effect.Animate.start(step, verify, completed);

		},


		/**
		 * Called on every step of the animation
		 *
		 * @param inMemory {Boolean?false} Whether to not render the current step, but keep it in memory only. Used internally only!
		 */
		__stepThroughDeceleration: function(render) {

			var self = this;


			//
			// COMPUTE NEXT SCROLL POSITION
			//

			// Add deceleration to scroll position
			var scrollLeft = self.__scrollLeft + self.__decelerationVelocityX;
			var scrollTop = self.__scrollTop + self.__decelerationVelocityY;


			//
			// HARD LIMIT SCROLL POSITION FOR NON BOUNCING MODE
			//

			if (!self.options.bouncing) {

				var scrollLeftFixed = Math.max(Math.min(self.__maxScrollLeft, scrollLeft), 0);
				if (scrollLeftFixed !== scrollLeft) {
					scrollLeft = scrollLeftFixed;
					self.__decelerationVelocityX = 0;
				}

				var scrollTopFixed = Math.max(Math.min(self.__maxScrollTop, scrollTop), 0);
				if (scrollTopFixed !== scrollTop) {
					scrollTop = scrollTopFixed;
					self.__decelerationVelocityY = 0;
				}

			}


			//
			// UPDATE SCROLL POSITION
			//

			if (render) {

				self.__publish(scrollLeft, scrollTop, self.__zoomLevel);

			} else {

				self.__scrollLeft = scrollLeft;
				self.__scrollTop = scrollTop;

			}


			//
			// SLOW DOWN
			//

			// Slow down velocity on every iteration
			if (!self.options.paging) {

				// This is the factor applied to every iteration of the animation
				// to slow down the process. This should emulate natural behavior where
				// objects slow down when the initiator of the movement is removed
				var frictionFactor = 0.95;

				self.__decelerationVelocityX *= frictionFactor;
				self.__decelerationVelocityY *= frictionFactor;

			}


			//
			// BOUNCING SUPPORT
			//

			if (self.options.bouncing) {

				var scrollOutsideX = 0;
				var scrollOutsideY = 0;

				// This configures the amount of change applied to deceleration/acceleration when reaching boundaries
				var penetrationDeceleration = 0.03;
				var penetrationAcceleration = 0.08;

				// Check limits
				if (scrollLeft < self.__minDecelerationScrollLeft) {
					scrollOutsideX = self.__minDecelerationScrollLeft - scrollLeft;
				} else if (scrollLeft > self.__maxDecelerationScrollLeft) {
					scrollOutsideX = self.__maxDecelerationScrollLeft - scrollLeft;
				}

				if (scrollTop < self.__minDecelerationScrollTop) {
					scrollOutsideY = self.__minDecelerationScrollTop - scrollTop;
				} else if (scrollTop > self.__maxDecelerationScrollTop) {
					scrollOutsideY = self.__maxDecelerationScrollTop - scrollTop;
				}

				// Slow down until slow enough, then flip back to snap position
				if (scrollOutsideX !== 0) {
					if (scrollOutsideX * self.__decelerationVelocityX <= 0) {
						self.__decelerationVelocityX += scrollOutsideX * penetrationDeceleration;
					} else {
						self.__decelerationVelocityX = scrollOutsideX * penetrationAcceleration;
					}
				}

				if (scrollOutsideY !== 0) {
					if (scrollOutsideY * self.__decelerationVelocityY <= 0) {
						self.__decelerationVelocityY += scrollOutsideY * penetrationDeceleration;
					} else {
						self.__decelerationVelocityY = scrollOutsideY * penetrationAcceleration;
					}
				}
			}
		}
	};

	// Copy over members to prototype
	for (var key in members) {
		Scroller.prototype[key] = members[key];
	}

})();
