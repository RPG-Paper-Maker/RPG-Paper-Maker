/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
