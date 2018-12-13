/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#ifndef PANELTEXTURES_H
#define PANELTEXTURES_H

#include <QWidget>
#include "systemtileset.h"
#include "systemspecialelement.h"
#include "widgettilesetselector.h"
#include "mapeditorsubselectionkind.h"

namespace Ui {
class PanelTextures;
}

class PanelTextures : public QWidget
{
    Q_OBJECT

public:
    explicit PanelTextures(QWidget *parent = 0);
    ~PanelTextures();
    void getTilesetTexture(QRect &rect) const;
    void setTilesetImage(QString path);
    void setTilesetImageNone();
    void showTileset();
    int getID() const;
    QWidget *getSpecialWidget() const;
    void hideAll();
    void showComboBox();
    void showWidgetSpecial();
    void updateComboBoxSize();
    void updateLabelSize();
    QString createlabelText();
    void showAutotiles(SystemTileset* tileset);
    void showSpriteWalls(SystemTileset* tileset);
    void fillComboBox(SystemTileset *tileset, PictureKind kind);

private:
    Ui::PanelTextures *ui;
    PictureKind m_kind;
    int m_currentAutotilesID;
    int m_currentWallsID;

    void updateTilesetImage();
    int getCurrentID() const;
    void updateCurrentID(int id);
    void updateImageSpecial(SystemSpecialElement *special);

private slots:
    void onSplitterMoved(int, int);
    void on_comboBox_currentIndexChanged(int);
};

#endif // PANELTEXTURES_H
