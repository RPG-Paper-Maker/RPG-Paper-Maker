/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "widgeticon.h"
#include "ui_widgeticon.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetIcon::WidgetIcon(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::WidgetIcon)
{
    ui->setupUi(this);
}

WidgetIcon::~WidgetIcon()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetIcon::initializeIcon(SystemIcon *icon) {
    m_icon = icon;

    connect(ui->widgetPicture, SIGNAL(pictureChanged(SystemPicture *)),
            this, SLOT(on_pictureChanged(SystemPicture *)));
    ui->widgetShowPicture->setActivateCoef(false);
    ui->widgetPicture->setKind(PictureKind::Icons);
    ui->widgetPicture->initialize(m_icon->pictureID());
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void WidgetIcon::on_pictureChanged(SystemPicture *picture) {
    ui->widgetShowPicture->updatePicture(picture, PictureKind::Icons);
    m_icon->setPictureID(picture->id());
}
