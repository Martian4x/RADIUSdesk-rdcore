// SPDX-FileCopyrightText: 2025 Dirk van der Walt <dirkvanderwalt@gmail.com>
//
// SPDX-License-Identifier: GPL-3.0-or-later
Ext.define('Rd.view.wireguard.vcWireguardPeerQrcode', {
    extend  : 'Ext.app.ViewController',
    alias   : 'controller.vcWireguardPeerQrcode',   
    config	: {
        urlToDisplay    : '/cake4/rd_cake/wireguard-peers/qrcode-config.json',
        qrValue         : ''
    },
    control: {
      	'pnlWireguardPeerQrcode'  : {
      	    activate  : 'onViewActivate'
      	},
      	'pnlWireguardPeerQrcode #sldrSize'  : {
      	    change  : 'updateQrCode'
      	}
    },        
    onViewActivate: function(pnl){
        var me      = this;
        var peer_id = me.getView().peer_id;
        Ext.Ajax.request({
            url     : me.getUrlToDisplay(),
            params  : {
                peer_id : peer_id   
            },
            method  : 'GET',
            success : function(response){
                var jsonData = Ext.JSON.decode(response.responseText);                
                if(jsonData.success){    
                    me.paintScreen(jsonData.data);                
                }else{
                                 
                }
            }
        });
    },
    paintScreen : function(data){
        const me = this;
        me.setQrValue(data.config);
        me.getView().down('#cntInfo').setData(data.metaData);
        me.updateQrCode();   
    },
    updateQrCode : function(data){
        const me    = this;
        const text  = me.getQrValue();
        const size  = me.getView().down('#sldrSize').getValue();        
        const container = me.getView().down('#cntDetailQr');

        // Remove all child components properly
        container.removeAll();

        // Add QR code as a proper component
        container.add({
            xtype   : 'component',
            style   : 'display:flex; align-items:center; justify-content:center; min-height:240px;',
            autoEl  : {
                tag: 'div',
                id: container.id + '-qr'
            },
            listeners: {
                afterrender: function(comp) {
                    new QRCode(comp.getEl().dom, {
                        text: text,
                        width: size,
                        height: size,
                        correctLevel: QRCode.CorrectLevel.M
                    });
                }
            }
        });
    },
    
    // -------- Export helpers ----------

    // Return a <canvas> with the QR, even if the lib produced an <img>
    getQrCanvas: function(){
        const view = this.getView();
        const container = view.down('#cntDetailQr');
        
        // Get the QR code component (first child of the container)
        const qrComponent = container.down('component[autoEl]') || container.items.first();
        if (!qrComponent || !qrComponent.rendered) {
            return null;
        }

        const holder = qrComponent.getEl().dom;
        if(!holder.firstChild){ 
            return null; 
        }

        const node = holder.firstChild; // canvas or img
        if (node.tagName && node.tagName.toLowerCase() === 'canvas') {
            return node;
        }

        // Fallback: draw <img> onto a canvas
        if (node.tagName && node.tagName.toLowerCase() === 'img') {
            const size = view.down('#sldrSize').getValue() || 220;
            const canvas = document.createElement('canvas');
            canvas.width  = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            // ensure white background (important for JPEG)
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, size, size);
            // draw the img
            ctx.drawImage(node, 0, 0, size, size);
            return canvas;
        }
        return null;
    },

    downloadDataUrl: function(dataUrl, filename){
        // create a temporary <a> and click
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    },

    // Public handler called by toolbar (type: 'png' or 'jpeg')
    exportQr: function(type){
        const canvas = this.getQrCanvas();
        if(!canvas){
            Ext.toast('QR not ready yet'); 
            return;
        }
        // mime & filename
        const mime = (type === 'jpeg') ? 'image/jpeg' : 'image/png';
        const ext  = (type === 'jpeg') ? 'jpg' : 'png';

        // if JPEG, make sure background is white (canvas from getQrCanvas already white)
        let exportCanvas = canvas;

        if (mime === 'image/jpeg') {
            // Ensure no transparency by drawing onto a white-backed canvas
            const c2 = document.createElement('canvas');
            c2.width = canvas.width;
            c2.height = canvas.height;
            const ctx2 = c2.getContext('2d');
            ctx2.fillStyle = '#ffffff';
            ctx2.fillRect(0, 0, c2.width, c2.height);
            ctx2.drawImage(canvas, 0, 0);
            exportCanvas = c2;
        }

        const dataUrl = exportCanvas.toDataURL(mime, 0.92);
        const peerId = this.getView().peer_id || 'wireguard-peer';
        const filename = peerId + '-qrcode.' + ext;

        this.downloadDataUrl(dataUrl, filename);
    }
        
});
