/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "widgeticon.h"
#include "ui_widgeticon.h"
#include "rpm.h"

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

    this->translate();
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

//-------------------------------------------------

void WidgetIcon::translate()
{

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
