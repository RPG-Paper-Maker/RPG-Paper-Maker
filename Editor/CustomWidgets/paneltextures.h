/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef PANELTEXTURES_H
#define PANELTEXTURES_H

#include <QWidget>
#include "systemtileset.h"
#include "systemspecialelement.h"
#include "widgettilesetselector.h"
#include "mapeditorsubselectionkind.h"

// -------------------------------------------------------
//
//  CLASS PanelTextures
//
//  A panel for displaying all the different textures selections.
//
// -------------------------------------------------------

namespace Ui {
class PanelTextures;
}

class PanelTextures : public QWidget
{
    Q_OBJECT

public:
    explicit PanelTextures(QWidget *parent = nullptr);
    ~PanelTextures();

    void getTilesetTexture(QRect &rect) const;
    void setTilesetImage(QString path);
    void setTilesetImageNone();
    void showTileset();
    int getID() const;
    QWidget * getSpecialWidget() const;
    void hideAll();
    void showComboBox();
    void showWidgetSpecial();
    void updateComboBoxSize();
    void updateLabelSize();
    QString createlabelText();
    void showAutotiles(SystemTileset *tileset);
    void showSpriteWalls(SystemTileset *tileset);
    void showObjects3D(SystemTileset *tileset);
    void fillComboBox(SystemTileset *tileset, PictureKind kind);
    void updateObject3DSize();

private:
    Ui::PanelTextures *ui;
    PictureKind m_kind;
    int m_currentAutotilesID;
    int m_currentWallsID;
    int m_currentObjects3DID;

    void updateTilesetImage();
    int getCurrentID() const;
    void updateCurrentID(int id);
    void updateImageSpecial(SystemSpecialElement *special);

private slots:
    void onSplitterMoved(int, int);
    void on_comboBox_currentIndexChanged(int);
};

#endif // PANELTEXTURES_H
