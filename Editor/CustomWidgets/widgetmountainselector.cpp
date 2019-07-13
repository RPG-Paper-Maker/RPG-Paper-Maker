/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "widgetmountainselector.h"
#include "ui_widgetmountainselector.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetMountainSelector::WidgetMountainSelector(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::WidgetMountainSelector)
{
    ui->setupUi(this);
}

WidgetMountainSelector::~WidgetMountainSelector()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetMountainSelector::initializeTilesetPictureID(int pictureID) {
    ui->widgetTilesetTexture->initialize(pictureID);
}

// -------------------------------------------------------

void WidgetMountainSelector::updatePicture(SystemPicture *picture, PictureKind
    kind)
{
    ui->widgetPreview->updatePicture(picture, kind);
}
