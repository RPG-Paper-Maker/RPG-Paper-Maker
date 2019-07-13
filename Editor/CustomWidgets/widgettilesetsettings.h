/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef WIDGETTILESETSETTINGS_H
#define WIDGETTILESETSETTINGS_H

#include <QWidget>
#include "systempicture.h"
#include "collisionsquare.h"

// -------------------------------------------------------
//
//  CLASS WidgetTilesetSettings
//
//  Widget used for choosing a setting picture existing in the database.
//
// -------------------------------------------------------

namespace Ui {
class WidgetTilesetSettings;
}

class WidgetTilesetSettings : public QWidget
{
    Q_OBJECT

public:
    explicit WidgetTilesetSettings(QWidget *parent = nullptr);
    ~WidgetTilesetSettings();
    void updateImage(SystemPicture* picture);
    void updateImageSpecial(QImage& editedImage, SystemPicture* picture);
    void updateImageAutotile(SystemPicture* picture);
    PictureKind kind() const;
    void setKind(PictureKind kind);
    void updateZoom(int zoom);
    void deleteDirectionTab();
    void showRepeat();
    void disableNone(bool b);

private:
    Ui::WidgetTilesetSettings *ui;
    int m_pictureID;
    PictureKind m_kind;
    float m_zoom;

protected:
    virtual void showEvent(QShowEvent *event);

public slots:
    void on_horizontalSlider_valueChanged(int value);
    void on_checkBoxRepeat_toggled(bool checked);
};

#endif // WIDGETTILESETSETTINGS_H
