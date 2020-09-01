/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    m_pictureID(-1)
{
    ui->setupUi(this);
    ui->checkBoxRepeat->hide();
    updateZoom(RPM::get()->engineSettings()->zoomPictures());

    this->translate();
}

WidgetTilesetSettings::~WidgetTilesetSettings()
{
    delete ui;
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

void WidgetTilesetSettings::updateImage(SystemPicture* picture) {
    m_pictureID = picture->id();
    ui->widgetTilesetPraticable->updateImage(picture, m_kind);
    ui->widgetTilesetDirection->updateImage(picture, m_kind);
    ui->checkBoxRepeat->setChecked(picture->repeatCollisions());
}

// -------------------------------------------------------

void WidgetTilesetSettings::updateImageSpecial(QImage& editedImage,
                                               SystemPicture* picture)
{
    m_pictureID = picture->id();
    ui->widgetTilesetPraticable->updateImageSpecial(editedImage, picture, m_kind);
    ui->widgetTilesetDirection->updateImageSpecial(editedImage, picture, m_kind);
    ui->checkBoxRepeat->setChecked(picture->repeatCollisions());
}

// -------------------------------------------------------

void WidgetTilesetSettings::updateImageAutotile(SystemPicture* picture) {
    QImage editedImage;
    QString path = picture->getPath();
    QImage image = (!path.isEmpty() && QFile::exists(path)) ? QImage(path) :
        QImage();
    if (!image.isNull()) {
        Map::editPictureAutotilePreview(image, editedImage);
    } else
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

//-------------------------------------------------

void WidgetTilesetSettings::translate()
{
    ui->checkBoxRepeat->setText(RPM::translate(Translations::REPEAT));
    ui->groupBoxZoom->setTitle(RPM::translate(Translations::ZOOM));
    ui->tabWidget->setTabText(0, RPM::translate(Translations::PRATICABLE));
    ui->tabWidget->setTabText(1, RPM::translate(Translations::DIRECTIONS));
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
    SystemPicture::getByID(m_pictureID, m_kind)->setRepeatCollisions(checked);
    ui->widgetTilesetPraticable->repaint();
}
