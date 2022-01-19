/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGTILESETTEXTURE_H
#define DIALOGTILESETTEXTURE_H

#include <QDialog>

// -------------------------------------------------------
//
//  CLASS DialogTilesetTexture
//
//  Dialog used for choosing a tileset rect.
//
// -------------------------------------------------------

namespace Ui {
class DialogTilesetTexture;
}

class DialogTilesetTexture : public QDialog
{
    Q_OBJECT

public:
    explicit DialogTilesetTexture(int pictureID, QRect& rect, QWidget *parent =
        nullptr);
    ~DialogTilesetTexture();

    QRect getRect() const;

private:
    Ui::DialogTilesetTexture *ui;

    void translate();
};

#endif // DIALOGTILESETTEXTURE_H
