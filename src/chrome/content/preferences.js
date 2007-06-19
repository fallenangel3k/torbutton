// PREFERences dialog functions
//   torbutton_prefs_set_field_attributes() -- initialize dialog fields
//   torbutton_prefs_init() -- on dialog load
//   torbutton_prefs_save() -- on dialog save

var tor_enabled = false;

function torbutton_prefs_set_field_attributes(doc)
{
    torbutton_log(4, "called prefs_set_field_attributes()");
    var o_torprefs = torbutton_get_prefbranch('extensions.torbutton.');
    var o_customprefs = torbutton_get_prefbranch('extensions.torbutton.custom.');

    doc.getElementById('torbutton_panelStyle').setAttribute("disabled", !doc.getElementById('torbutton_displayStatusPanel').checked);
    doc.getElementById('torbutton_panelStyleText').setAttribute("disabled", !doc.getElementById('torbutton_displayStatusPanel').checked);
    doc.getElementById('torbutton_panelStyleIcon').setAttribute("disabled", !doc.getElementById('torbutton_displayStatusPanel').checked);
    // Privoxy is always recommended for Firefoxes not support socks_remote_dns
    if (!torbutton_check_socks_remote_dns()) {
      doc.getElementById('torbutton_usePrivoxy').setAttribute("disabled", true);
    } else {
      doc.getElementById('torbutton_usePrivoxy').setAttribute("disabled", doc.getElementById('torbutton_settingsMethod').value != 'recommended');
    }
    var proxy_port;
    var proxy_host;
    if (doc.getElementById('torbutton_usePrivoxy').checked) {
        proxy_host = 'localhost';
        proxy_port = 8118;
    } else {
        proxy_host = '';
        proxy_port = 0;
    }

    if (doc.getElementById('torbutton_settingsMethod').value == 'recommended') {
        torbutton_log(5, "using recommended settings");
        if (!torbutton_check_socks_remote_dns()) {
            doc.getElementById('torbutton_httpProxy').value = proxy_host;
            doc.getElementById('torbutton_httpPort').value = proxy_port;
            doc.getElementById('torbutton_httpsProxy').value = proxy_host;
            doc.getElementById('torbutton_httpsPort').value = proxy_port;
            doc.getElementById('torbutton_ftpProxy').value = proxy_host;
            doc.getElementById('torbutton_ftpPort').value = proxy_port;
            doc.getElementById('torbutton_gopherProxy').value = proxy_host;
            doc.getElementById('torbutton_gopherPort').value = proxy_port;
        } else {
            doc.getElementById('torbutton_httpProxy').value = proxy_host;
            doc.getElementById('torbutton_httpPort').value = proxy_port;
            doc.getElementById('torbutton_httpsProxy').value = proxy_host;
            doc.getElementById('torbutton_httpsPort').value = proxy_port;

            doc.getElementById('torbutton_ftpProxy').value = '';
            doc.getElementById('torbutton_ftpPort').value = 0;
            doc.getElementById('torbutton_gopherProxy').value = '';
            doc.getElementById('torbutton_gopherPort').value = 0;
        }
        doc.getElementById('torbutton_socksHost').value = 'localhost';
        doc.getElementById('torbutton_socksPort').value = 9050;

        doc.getElementById('torbutton_httpProxy').disabled = true;
        doc.getElementById('torbutton_httpPort').disabled = true;
        doc.getElementById('torbutton_httpsProxy').disabled = true;
        doc.getElementById('torbutton_httpsPort').disabled = true;
        doc.getElementById('torbutton_ftpProxy').disabled = true;
        doc.getElementById('torbutton_ftpPort').disabled = true;
        doc.getElementById('torbutton_gopherProxy').disabled = true;
        doc.getElementById('torbutton_gopherPort').disabled = true;
        doc.getElementById('torbutton_socksHost').disabled = true;
        doc.getElementById('torbutton_socksPort').disabled = true;
    } else {
        doc.getElementById('torbutton_httpProxy').disabled = false;
        doc.getElementById('torbutton_httpPort').disabled = false;
        doc.getElementById('torbutton_httpsProxy').disabled = false;
        doc.getElementById('torbutton_httpsPort').disabled = false;
        doc.getElementById('torbutton_ftpProxy').disabled = false;
        doc.getElementById('torbutton_ftpPort').disabled = false;
        doc.getElementById('torbutton_gopherProxy').disabled = false;
        doc.getElementById('torbutton_gopherPort').disabled = false;
        doc.getElementById('torbutton_socksHost').disabled = false;
        doc.getElementById('torbutton_socksPort').disabled = false;
        doc.getElementById('torbutton_httpProxy').value    = o_customprefs.getCharPref('http_proxy');
        doc.getElementById('torbutton_httpPort').value     = o_customprefs.getIntPref('http_port');
        doc.getElementById('torbutton_httpsProxy').value   = o_customprefs.getCharPref('https_proxy');
        doc.getElementById('torbutton_httpsPort').value    = o_customprefs.getIntPref('https_port');
        doc.getElementById('torbutton_ftpProxy').value     = o_customprefs.getCharPref('ftp_proxy');
        doc.getElementById('torbutton_ftpPort').value      = o_customprefs.getIntPref('ftp_port');
        doc.getElementById('torbutton_gopherProxy').value  = o_customprefs.getCharPref('gopher_proxy');
        doc.getElementById('torbutton_gopherPort').value   = o_customprefs.getIntPref('gopher_port');
        doc.getElementById('torbutton_socksHost').value    = o_customprefs.getCharPref('socks_host');
        doc.getElementById('torbutton_socksPort').value    = o_customprefs.getIntPref('socks_port');
    }
}

function torbutton_prefs_init(doc) {
    var checkbox_displayStatusPanel = doc.getElementById('torbutton_displayStatusPanel');
// return; 

    torbutton_log(4, "called prefs_init()");
    sizeToContent();

    // remember if tor settings were enabled when the window was opened
    tor_enabled = torbutton_check_status();

    var o_torprefs = torbutton_get_prefbranch('extensions.torbutton.');

    doc.getElementById('torbutton_displayStatusPanel').checked = o_torprefs.getBoolPref('display_panel');
    var panel_style = doc.getElementById('torbutton_panelStyle');
    var panel_style_pref = o_torprefs.getCharPref('panel_style');
    if (panel_style_pref == 'text')
        panel_style.selectedItem = doc.getElementById('torbutton_panelStyleText');
    else if (panel_style_pref == 'iconic')
        panel_style.selectedItem = doc.getElementById('torbutton_panelStyleIcon');
    // doc.getElementById('torbutton_panelStyle').value = o_torprefs.getCharPref('panel_style');
    var settings_method = doc.getElementById('torbutton_settingsMethod');
    var settings_method_pref = o_torprefs.getCharPref('settings_method');
    if (settings_method_pref == 'recommended')
        settings_method.selectedItem = doc.getElementById('torbutton_useRecommendedSettings');
    else if (settings_method_pref == 'custom')
        settings_method.selectedItem = doc.getElementById('torbutton_useCustomSettings');
    // doc.getElementById('torbutton_settingsMethod').value = o_torprefs.getCharPref('settings_method');
    doc.getElementById('torbutton_usePrivoxy').checked = o_torprefs.getBoolPref('use_privoxy');
    doc.getElementById('torbutton_httpProxy').value    = o_torprefs.getCharPref('http_proxy');
    doc.getElementById('torbutton_httpPort').value     = o_torprefs.getIntPref('http_port');
    doc.getElementById('torbutton_httpsProxy').value   = o_torprefs.getCharPref('https_proxy');
    doc.getElementById('torbutton_httpsPort').value    = o_torprefs.getIntPref('https_port');
    doc.getElementById('torbutton_ftpProxy').value     = o_torprefs.getCharPref('ftp_proxy');
    doc.getElementById('torbutton_ftpPort').value      = o_torprefs.getIntPref('ftp_port');
    doc.getElementById('torbutton_gopherProxy').value  = o_torprefs.getCharPref('gopher_proxy');
    doc.getElementById('torbutton_gopherPort').value   = o_torprefs.getIntPref('gopher_port');
    doc.getElementById('torbutton_socksHost').value    = o_torprefs.getCharPref('socks_host');
    doc.getElementById('torbutton_socksPort').value    = o_torprefs.getIntPref('socks_port');
    // doc.getElementById('torbutton_warnUponExcludedSite').checked = o_torprefs.getBoolPref('prompt_before_visiting_excluded_sites');

    doc.getElementById('torbutton_disablePlugins').checked = o_torprefs.getBoolPref('no_tor_plugins');
    doc.getElementById('torbutton_clearHistory').checked = o_torprefs.getBoolPref('clear_history');
    doc.getElementById('torbutton_killBadJS').checked = o_torprefs.getBoolPref('kill_bad_js');
    
    if(o_torprefs.getBoolPref('clear_cache')) {
        doc.getElementById('torbutton_cacheGroup').selectedItem =
            doc.getElementById('torbutton_clearCache');
        o_torprefs.setBoolPref('block_cache', false);
    } else {
        doc.getElementById('torbutton_cacheGroup').selectedItem =
            doc.getElementById('torbutton_blockCache');
        o_torprefs.setBoolPref('block_cache', true);
        o_torprefs.setBoolPref('clear_cache', false);
    }
        
    if(o_torprefs.getBoolPref('clear_cookies')) {
        doc.getElementById('torbutton_cookieGroup').selectedItem = 
            doc.getElementById('torbutton_clearCookies');
        o_torprefs.setBoolPref('cookie_jars', false);
    } else {
        doc.getElementById('torbutton_cookieGroup').selectedItem =
            doc.getElementById('torbutton_cookieJars');
        o_torprefs.setBoolPref('cookie_jars', true);
        o_torprefs.setBoolPref('clear_cookies', false); 
    }

    doc.getElementById('torbutton_blockTorHRead').checked = o_torprefs.getBoolPref('block_thread');
    doc.getElementById('torbutton_blockTorHWrite').checked = o_torprefs.getBoolPref('block_thwrite');
    doc.getElementById('torbutton_blockNonTorHRead').checked = o_torprefs.getBoolPref('block_nthread');
    doc.getElementById('torbutton_blockNonTorHWrite').checked = o_torprefs.getBoolPref('block_nthwrite');
    doc.getElementById('torbutton_isolateContent').checked = o_torprefs.getBoolPref('isolate_content');
    doc.getElementById('torbutton_noSearch').checked = o_torprefs.getBoolPref('no_search');
    doc.getElementById('torbutton_noUpdates').checked = o_torprefs.getBoolPref('no_updates');
    doc.getElementById('torbutton_setUagent').checked = o_torprefs.getBoolPref('set_uagent');

    torbutton_prefs_set_field_attributes(doc);
}

function torbutton_prefs_save(doc) {
    torbutton_log(4, "called prefs_save()");
    var o_torprefs = torbutton_get_prefbranch('extensions.torbutton.');
    var o_customprefs = torbutton_get_prefbranch('extensions.torbutton.custom.');

    o_torprefs.setBoolPref('display_panel',   doc.getElementById('torbutton_displayStatusPanel').checked);
    o_torprefs.setCharPref('panel_style',     doc.getElementById('torbutton_panelStyle').value);
    o_torprefs.setCharPref('settings_method', doc.getElementById('torbutton_settingsMethod').value);
    o_torprefs.setBoolPref('use_privoxy',     doc.getElementById('torbutton_usePrivoxy').checked);
    o_torprefs.setCharPref('http_proxy',      doc.getElementById('torbutton_httpProxy').value);
    o_torprefs.setIntPref('http_port',        doc.getElementById('torbutton_httpPort').value);
    o_torprefs.setCharPref('https_proxy',     doc.getElementById('torbutton_httpsProxy').value);
    o_torprefs.setIntPref('https_port',       doc.getElementById('torbutton_httpsPort').value);
    o_torprefs.setCharPref('ftp_proxy',       doc.getElementById('torbutton_ftpProxy').value);
    o_torprefs.setIntPref('ftp_port',         doc.getElementById('torbutton_ftpPort').value);
    o_torprefs.setCharPref('gopher_proxy',    doc.getElementById('torbutton_gopherProxy').value);
    o_torprefs.setIntPref('gopher_port',      doc.getElementById('torbutton_gopherPort').value);
    o_torprefs.setCharPref('socks_host',      doc.getElementById('torbutton_socksHost').value);
    o_torprefs.setIntPref('socks_port',       doc.getElementById('torbutton_socksPort').value);

    if (doc.getElementById('torbutton_settingsMethod').value == 'custom') {
        o_customprefs.setCharPref('http_proxy',      doc.getElementById('torbutton_httpProxy').value);
        o_customprefs.setIntPref('http_port',        doc.getElementById('torbutton_httpPort').value);
        o_customprefs.setCharPref('https_proxy',     doc.getElementById('torbutton_httpsProxy').value);
        o_customprefs.setIntPref('https_port',       doc.getElementById('torbutton_httpsPort').value);
        o_customprefs.setCharPref('ftp_proxy',       doc.getElementById('torbutton_ftpProxy').value);
        o_customprefs.setIntPref('ftp_port',         doc.getElementById('torbutton_ftpPort').value);
        o_customprefs.setCharPref('gopher_proxy',    doc.getElementById('torbutton_gopherProxy').value);
        o_customprefs.setIntPref('gopher_port',      doc.getElementById('torbutton_gopherPort').value);
        o_customprefs.setCharPref('socks_host',      doc.getElementById('torbutton_socksHost').value);
        o_customprefs.setIntPref('socks_port',       doc.getElementById('torbutton_socksPort').value);
    }
    // o_torprefs.setBoolPref('prompt_before_visiting_excluded_sites', doc.getElementById('torbutton_warnUponExcludedSite').checked);

    o_torprefs.setBoolPref('no_tor_plugins', doc.getElementById('torbutton_disablePlugins').checked);
    o_torprefs.setBoolPref('clear_history', doc.getElementById('torbutton_clearHistory').checked);
    o_torprefs.setBoolPref('kill_bad_js', doc.getElementById('torbutton_killBadJS').checked);
    o_torprefs.setBoolPref('isolate_content', doc.getElementById('torbutton_isolateContent').checked);

    o_torprefs.setBoolPref('clear_cache', doc.getElementById('torbutton_clearCache').selected);
    o_torprefs.setBoolPref('block_cache', doc.getElementById('torbutton_blockCache').selected);
    o_torprefs.setBoolPref('clear_cookies', doc.getElementById('torbutton_clearCookies').selected);
    o_torprefs.setBoolPref('cookie_jars', doc.getElementById('torbutton_cookieJars').selected);
    
    o_torprefs.setBoolPref('block_thread', doc.getElementById('torbutton_blockTorHRead').checked);
    o_torprefs.setBoolPref('block_thwrite', doc.getElementById('torbutton_blockTorHWrite').checked);
    o_torprefs.setBoolPref('block_nthread', doc.getElementById('torbutton_blockNonTorHRead').checked);
    o_torprefs.setBoolPref('block_nthwrite', doc.getElementById('torbutton_blockNonTorHWrite').checked);
    o_torprefs.setBoolPref('no_search', doc.getElementById('torbutton_noSearch').checked);
    o_torprefs.setBoolPref('no_updates', doc.getElementById('torbutton_noUpdates').checked);
    
    o_torprefs.setBoolPref('set_uagent', doc.getElementById('torbutton_setUagent').checked);

    // if tor settings were initially active, update the active settings to reflect any changes
    if (tor_enabled) torbutton_activate_tor_settings();
}
