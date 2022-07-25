if (window.frameElement) {
    let ytIcon = '';
    const adminlinks = 'https://cdn.arenacommerce.com/admin-help/electro/assistant.js';
    $(document).ready(function () {
        /**
         * APPEND HELP INFO CONTENT
         */
        setTimeout(function () {
            // Show helper section cotent wrapper
            let showHelpers = $(parent.document.getElementsByClassName("te-panel"));
            let showHelper = null;
            showHelpers.each(function (index, elem) {
                if ($(elem).attr('data-panel-slug') === 'dear-valued-customer') {
                    showHelper = $(elem);
                }
            });
            // Show helper section content inner
            let showHelper__Inner = showHelper.find('.next-card__section');
            if (showHelper__Inner.length) {
                $.ajax({
                    url: '//xadmin.arenacommerce.com/api/support-content',
                    dataType: 'html text',
                    success: function (data) {
                        let _data = $(data);
                        // prevent duplicate
                        if (!showHelper__Inner.find('.support-content').length) {
                            showHelper__Inner.append(_data);
                        }
                    },
                    error: function (err) { }
                });
            }

            $(parent.document).off('click.arn').on('click.arn', '.theme-editor-action-list > li', (e) => {
                setTimeout(() => {
                    let activePanel = parent.document.getElementsByClassName('te-panel--is-active');
                    if ($(activePanel).length) {
                        let panelId = $(activePanel).attr('id');
                        if (panelId !== 'add-section-panel') {
                            // section
                            if (panelId.match(/section-.*/gm)) {
                                panelId = panelId.replace('section-', '').replace(/-[0-9]+/g, '');
                                if (panelId in json.youtube) {
                                    setIconYoutube($(activePanel), panelId);
                                }

                                // header style
                                if (panelId === 'header-header' && 'header_styles' in json) {
                                    //let selector = $(activePanel).find('#setting-header-header_style');
                                    let selector = $(activePanel).find('.theme-setting--range__slider[name="settings[sections][header][settings][header_style]"]');
                                    let currentSelectVal = selector.val() - 1;

                                    if (json['header_styles'][currentSelectVal]) {
                                        setHeaderStyleImg(selector, json['header_styles'][currentSelectVal]);
                                    } else {
                                        selector.parents('.theme-setting').find('img').remove();
                                    }
                                    selector.off('change.arn').on('change.arn', (e) => {
                                        let curVal = e.currentTarget.value - 1;

                                        if (json['header_styles'][curVal]) {
                                            setHeaderStyleImg($(e.currentTarget), json['header_styles'][curVal]);
                                        } else {
                                            $(e.currentTarget).parents('.theme-setting').find('img').remove();
                                        }
                                    })
                                }

                                // mobile header style
                                if (panelId === 'header-header' && 'mobile_header_styles' in json) {
                                    let selector_2 = $(activePanel).find('.theme-setting--range__slider[name="settings[sections][header][settings][mobile_header_style]"]');
                                    let currentSelectVal_2 = selector_2.val() - 1;

                                    if (json['mobile_header_styles'][currentSelectVal_2]) {
                                        setHeaderStyleImg(selector_2, json['mobile_header_styles'][currentSelectVal_2]);
                                    } else {
                                        selector_2.parents('.theme-setting').find('img').remove();
                                    }
                                    selector_2.off('change.arn').on('change.arn', (e) => {
                                        let curVal_2 = e.currentTarget.value - 1;

                                        if (json['mobile_header_styles'][curVal_2]) {
                                            setHeaderStyleImg($(e.currentTarget), json['mobile_header_styles'][curVal_2]);
                                        } else {
                                            $(e.currentTarget).parents('.theme-setting').find('img').remove();
                                        }
                                    })
                                }
                            }
                            // settings
                            if ($(activePanel).attr('data-panel-slug')) {

                            }

                        }
                    }
                }, 1000)
            })

        }, 3000);

        /**
         * CHECK JSON DATA THEN ADD TO DOM
         */
        var s = document.createElement('script');
        s.setAttribute('src', adminlinks);
        s.setAttribute('crossorigin', 'anonymous');
        s.onload = jsonReady;
        document.body.appendChild(s);
    });
    function jsonReady() {
        ytIcon = json.icon_youtube;
        setNewSectionImages();
    }
    function setHeaderStyleImg(target, link) {
        let _parent = target.parents('.theme-setting');
        let sampleImg = $(`<img class="header-style-image" src="${link}" alt="header style image">`).css('margin-top', '10px');
        if (!_parent.find('img').length) {
            _parent.append(sampleImg);
        } else {
            _parent.find('img').remove();
            _parent.append(sampleImg);
        }
    }
    function setIconYoutube(target, sectionName) {
        let $h2 = target.find('.te-panel__header >h2');
        let ytLink = json.youtube[sectionName];
        if ($h2.find("img").length == 0) {
            $h2.append(ytIcon);
            $h2.find("img").attr("data-link", ytLink).click(function () {
                window.open($(this).attr('data-link'), '_blank');
            });
        }
    }

    function setNewSectionImages() {
        let addSectionBtns = $(parent.document.getElementsByClassName("theme-editor__add-section"));
        addSectionBtns.map((index, btn_wrap) => {
            let sectionName = $(btn_wrap).attr('data-new-section');
            let btn = $(btn_wrap).find('.theme-editor__add-section-item');
            sectionName = sectionName.replace(/(\{|\}|\")/gm, "");
            let matchRegex = sectionName.match(/type:\s*.+(?=,)/gm);

            if (matchRegex) {
                sectionName = matchRegex[0].replace("type:", "").trim();
            } else {
                sectionName = '';
            }
            if (sectionName && sectionName in json.images) {
                if (!btn.find('.section-sample-image').length) {
                    let sampleImg = $(`<img class="section-sample-image" src="${json.images[sectionName]}" alt="section image">`);

                    sampleImg.css({
                        marginTop: '10px',
                        width: '100%',
                    });

                    btn.append(sampleImg).css('padding', '15px');
                }
            }

        })

    }
}