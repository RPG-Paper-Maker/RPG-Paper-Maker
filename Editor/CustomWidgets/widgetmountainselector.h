/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef WIDGETMOUNTAINSELECTOR_H
#define WIDGETMOUNTAINSELECTOR_H

#include <QWidget>
#include "systempicture.h"

// -------------------------------------------------------
//
//  CLASS WidgetMountainSelector
//
//  Widget used for panel textures for mountains.
//
// -------------------------------------------------------

namespace Ui {
class WidgetMountainSelector;
}

class WidgetMountainSelector : public QWidget
{
    Q_OBJECT

public:
    explicit WidgetMountainSelector(QWidget *parent = nullptr);
    ~WidgetMountainSelector();

    void initializeTilesetPictureID(int pictureID);
    void updatePicture(SystemPicture *picture, PictureKind kind);

private:
    Ui::WidgetMountainSelector *ui;
};

#endif // WIDGETMOUNTAINSELECTOR_H
