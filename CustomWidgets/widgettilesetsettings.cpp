/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "widgettilesetsettings.h"
#include "ui_widgettilesetsettings.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetTilesetSettings::WidgetTilesetSettings(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::WidgetTilesetSettings),
    m_picture(nullptr)
{
    ui->setupUi(this);
    ui->checkBoxRepeat->hide();
    updateZoom(RPM::get()->engineSettings()->zoomPictures());
}

WidgetTilesetSettings::~WidgetTilesetSettings()
{
    delete ui;
}

void WidgetTilesetSettings::setSquares(QHash<QPoint, CollisionSquare*>* squares)
{
    ui->widgetTilesetPraticable->setSquares(squares);
    ui->widgetTilesetDirection->setSquares(squares);
}

PictureKind WidgetTilesetSettings::kind() const {
    return m_kind;
}

void WidgetTilesetSettings::setKind(PictureKind kind) {
    m_kind = kind;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetTilesetSettings::updateImage(SystemPicture* picture){
    m_picture = picture;
    ui->widgetTilesetPraticable->updateImage(picture, m_kind);
    ui->widgetTilesetDirection->updateImage(picture, m_kind);
    ui->checkBoxRepeat->setChecked(picture->repeatCollisions());
}

// -------------------------------------------------------

void WidgetTilesetSettings::updateImageSpecial(QImage& editedImage,
                                               SystemPicture* picture)
{
    m_picture = picture;
    ui->widgetTilesetPraticable->updateImageSpecial(editedImage, picture);
    ui->widgetTilesetDirection->updateImageSpecial(editedImage);
    ui->checkBoxRepeat->setChecked(picture->repeatCollisions());
}

// -------------------------------------------------------

void WidgetTilesetSettings::updateImageAutotile(SystemPicture* picture) {
    QImage editedImage;
    QString path = picture->getPath(PictureKind::Autotiles);
    QImage image = (!path.isEmpty() && QFile::exists(path)) ? QImage(path) :
        QImage();
    if (!image.isNull())
        Map::editPictureAutotilePreview(image, editedImage);
    else
        editedImage = image;
    updateImageSpecial(editedImage, picture);
}

// -------------------------------------------------------

void WidgetTilesetSettings::updateZoom(int zoom) {
    m_zoom = 1.0;
    if (zoom > 0)
        m_zoom *= (zoom + 1);
    else if (zoom < 0)
        m_zoom /= ((-zoom) + 1);
    ui->horizontalSlider->setValue(zoom);
    ui->widgetTilesetPraticable->updateZoom(m_zoom);
}

// -------------------------------------------------------

void WidgetTilesetSettings::deleteDirectionTab() {
    ui->tabWidget->removeTab(1);
}

// -------------------------------------------------------

void WidgetTilesetSettings::showRepeat() {
    ui->checkBoxRepeat->show();
}

// -------------------------------------------------------

void WidgetTilesetSettings::disableNone(bool b) {
    ui->horizontalSlider->setEnabled(!b);
    ui->checkBoxRepeat->setEnabled(!b);
}

// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

void WidgetTilesetSettings::showEvent(QShowEvent *event) {
    updateZoom(RPM::get()->engineSettings()->zoomPictures());
    QWidget::showEvent(event);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void WidgetTilesetSettings::on_horizontalSlider_valueChanged(int value) {
    updateZoom(value);

    // Update in the settings
    RPM::get()->engineSettings()->setZoomPictures(value);
}

// -------------------------------------------------------

void WidgetTilesetSettings::on_checkBoxRepeat_toggled(bool checked) {
    m_picture->setRepeatCollisions(checked, m_kind);
    ui->widgetTilesetPraticable->repaint();
}
