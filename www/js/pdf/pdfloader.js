/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


//
// If absolute URL from the remote server is provided, configure the CORS
// header on that server.
//

function loadFirstPagePDF(url, canvas_id){
  console.log("cargando "+url+" en el canvas"+canvas_id)
  var url = url;
  var pdfDoc = null;
  var pageNum = 1;
  var pageRendering = false;
  var pageNumPending = null;
  var scale = 2;
  var canvas = document.getElementById(canvas_id);
  var ctx = canvas.getContext('2d');

  PDFJS.getDocument(url).then(function (pdfDoc_) {
              pdfDoc = pdfDoc_;
              pdfDoc.getPage(1).then(function (page) {
                  var viewport = page.getViewport(scale);
                  canvas.height = viewport.height;
                  canvas.width = viewport.width;

                  // Render PDF page into canvas context
                  var renderContext = {
                      canvasContext: ctx,
                      viewport: viewport
                  };
                  var renderTask = page.render(renderContext);
              });
          });
}

function LoadPDF() {
    var url = pdfname;

    var pdfDoc = null,
            pageNum = 1,
            pageRendering = false,
            pageNumPending = null,
            scale = 2
    canvas = document.getElementById('pdf_viewer'),
            ctx = canvas.getContext('2d');


    function renderPage(num) {
        pageRendering = true;
        // Using promise to fetch the page
        pdfDoc.getPage(num).then(function (page) {
            var viewport = page.getViewport(scale);
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page into canvas context
            var renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };
            var renderTask = page.render(renderContext);

            // Wait for rendering to finish
            renderTask.promise.then(function () {
                pageRendering = false;
                if (pageNumPending !== null) {
                    // New page rendering is pending
                    renderPage(pageNumPending);
                    pageNumPending = null;
                }
            });
        });

        // Update page counters
        document.getElementById('page_num').textContent = pageNum;
    }

    /**
     * If another page rendering in progress, waits until the rendering is
     * finised. Otherwise, executes rendering immediately.
     */
    function queueRenderPage(num) {
        if (pageRendering) {
            pageNumPending = num;
        } else {
            renderPage(num);
        }
    }

    /**
     * Displays previous page.
     */
    function onPrevPage() {
        if (pageNum <= 1) {
            return;
        }
        pageNum--;
        queueRenderPage(pageNum);
    }
    document.getElementById('prev').addEventListener('click', onPrevPage);

    /**
     * Displays next page.
     */
    function onNextPage() {
        if (pageNum >= pdfDoc.numPages) {
            return;
        }
        pageNum++;
        queueRenderPage(pageNum);
    }
    document.getElementById('next').addEventListener('click', onNextPage);

    PDFJS.getDocument(url).then(function (pdfDoc_) {
        pdfDoc = pdfDoc_;
        document.getElementById('page_count').textContent = pdfDoc.numPages;

        // Initial/first page rendering
        renderPage(pageNum);

    });
    document.getElementById('next').style.display = 'inline-block';
    document.getElementById('prev').style.display = 'inline-block';
    document.getElementById('detail').style.display = 'inline-block';
    canvas.style.display = 'block';
    console.log(canvas)

}


/**
 * Asynchronously downloads PDF.
 */
