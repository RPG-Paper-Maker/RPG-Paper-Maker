/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef WIDGETTILESETTEXTURE_H
#define WIDGETTILESETTEXTURE_H

#include <QWidget>
#include <QListWidgetItem>

// -------------------------------------------------------
//
//  CLASS WidgetTilesetTexture
//
//  Widget used for choosing a tileset rect.
//
// -------------------------------------------------------

namespace Ui {
class WidgetTilesetTexture;
}

class WidgetTilesetTexture : public QWidget
{
    Q_OBJECT

public:
    explicit WidgetTilesetTexture(QWidget *parent = nullptr);
    ~WidgetTilesetTexture();
    void getRect(QRect &rect) const;

    void initialize(int pictureID);
    void updateText();
    void openDialog();

private:
    Ui::WidgetTilesetTexture *ui;

protected:
    int m_pictureID;
    QRect m_rect;

private slots:
    void on_listWidget_itemDoubleClicked(QListWidgetItem*);
    void on_pushButton_clicked();
};

#endif // WIDGETTILESETTEXTURE_H
