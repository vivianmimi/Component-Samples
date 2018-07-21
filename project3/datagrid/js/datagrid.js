function DataGrid(grid) {
    this.data = grid.data;
    this.rootElement = grid.rootElement;
    this.columns = grid.columns;
    this.pageSize = grid.pageSize;
    this.onRender = grid.onRender;
    this.init();

}

(function (win) {

    DataGrid.prototype.sort = function (label) {
        this.data.sort(
            function (a, b) {
                return ((a[label] < b[label]) ? -1 : ((a[label] > b[label]) ? 1 : 0));
            }
        );
        this.renderTable(1);

    };

    DataGrid.prototype.reverse = function () {
        this.data.reverse();
        this.renderTable(1);

    };

    DataGrid.prototype.renderTable = function (pageIndex) {

        var totalpage = Math.ceil(this.data.length / this.pageSize);
        this.destroy();
        //here that and this
        if (typeof(this.onRender) !== 'undefined') {
            var that = this;
            this.onRender(that);
        }


        var table = document.createElement("table");
        if (typeof(this.pageSize) !== 'undefined') {
            var trtr = document.createElement("caption");
            var pre = document.createElement("submit");
            pre.setAttribute("class", "prepage");
            pre.innerHTML = "< Previous";
            if (pageIndex == 1) {
                pre.setAttribute("disabled", "disabled");
            } else {
                pre.removeAttribute("disabled");
            }

            pre.addEventListener("click", previousPage.bind(this), false);

            var pagenumber = document.createElement("span");
            pagenumber.setAttribute("class", "pageindex");
            pagenumber.textContent = "    " + pageIndex + "of" + "    " + totalpage;


            var next = document.createElement("submit");
            next.setAttribute("class", "nextpage");
            if (pageIndex == totalpage) {
                next.setAttribute("disabled", "disabled");
            } else {
                next.removeAttribute("disabled");
            }
            next.innerHTML = "Next >";
            next.addEventListener("click", nextPage.bind(this), false);

            trtr.appendChild(pre);
            trtr.appendChild(pagenumber);
            trtr.appendChild(next);
            table.appendChild(trtr);
        }
        var thead = document.createElement("thead");
        var trHead = document.createElement("tr");
        for (var a in this.columns) {
            var th = document.createElement("th");
            th.innerHTML = this.columns[a]["name"];
            th.setAttribute("align", this.columns[a]["align"]);
            th.setAttribute("width", this.columns[a]["width"]);
            th.setAttribute("data-name", this.columns[a]["dataName"]);
            th.setAttribute("title", "Sort by " + this.columns[a]["name"]);
            th.addEventListener("click", this.onclick.bind(this), false);
            trHead.appendChild(th);
        
        }
        thead.appendChild(trHead);
  
        table.appendChild(thead);
        var tbody = document.createElement("tbody");
        var start = 0;
        var end = 0;
        if (typeof(this.pageSize) !== 'undefined') {
            start = (pageIndex - 1) * this.pageSize;
            end = pageIndex * this.pageSize;
        }
        else {
            end = this.data.length;
        }
        for (var i = start; i < this.data.length && i < end; i++) {
            var tr = document.createElement("tr");

            for (var c in this.columns) {
                var td = document.createElement("td");
                var label = this.columns[c]["dataName"];
                td.innerHTML = this.data[i][label];
                td.setAttribute("align", this.columns[c]["align"]);
                td.setAttribute("width", this.columns[c]["width"]);
                td.setAttribute("class", label);
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }

        table.appendChild(tbody);
        console.log(table);
        this.rootElement.appendChild(table);
        var ohno = this;

        function previousPage() {
            if (pageIndex > 1) {
                pageIndex--;
            } else {
                alert("this is the first page");
            }
            ohno.renderTable(pageIndex);
    
        }

        function nextPage() {
            if (pageIndex < totalpage) {
                pageIndex++;
            } else {
                alert("this is the last page");
            }
            ohno.renderTable(pageIndex);
          
        }

    };


    DataGrid.prototype.onclick = function (event) {

        if (typeof(event.target) !== 'undefined' && this.rootElement !== 'undefined') {
            var name = event.target.getAttribute("data-name");
            var col = this.rootElement.getElementsByClassName(name);

            if (col[0].className == name + " col-select") {
                this.reverse();
            }
            else {
                this.sort(name);
            }
            col = this.rootElement.getElementsByClassName(name);
            for (i = 0; i < col.length; i++) {
                col[i].className += " col-select";
            }

        }
    };

    DataGrid.prototype.destroy = function () {
        if (typeof(this.rootElement) !== 'undefined') {
            this.rootElement.innerHTML = "";
        }
    };

    DataGrid.prototype.init = function () {
        if (typeof(this.columns) !== 'undefined') {
            this.sort(this.columns[0].dataName);

            var col = this.rootElement.getElementsByClassName(this.columns[0].dataName);
            for (i = 0; i < col.length; i++) {
                col[i].className += " col-select";
            }
        }
    };


})(window);
