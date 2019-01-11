#include "dialogsystemwindowskin.h"
#include "ui_dialogsystemwindowskin.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemWindowSkin::DialogSystemWindowSkin(SystemWindowSkin& windowSkin,
    QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemWindowSkin),
    m_windowSkin(windowSkin)
{
    ui->setupUi(this);

    initialize();
}

DialogSystemWindowSkin::~DialogSystemWindowSkin()
{
    delete ui;
}


// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemWindowSkin::initialize() {
    SystemPicture *picture = reinterpret_cast<SystemPicture *>(SuperListItem
        ::getById(RPM::get()->project()->picturesDatas()->model(PictureKind
        ::WindowSkins)->invisibleRootItem(), m_windowSkin.pictureID()));

    ui->widgetShowPicture->setCover(true);
    ui->widgetPicture->setKind(PictureKind::WindowSkins);
    connect(ui->widgetPicture, SIGNAL(pictureChanged(SystemPicture *)), this,
        SLOT(on_pictureChanged(SystemPicture *)));
    ui->widgetPicture->setPicture(picture);
    on_pictureChanged(picture);
    updateZoom(RPM::get()->engineSettings()->zoomPictures());

    // Rect selectors
    ui->widgetSelectRectTopLeft->updateLabel("Top-Left");
    ui->widgetSelectRectTopLeft->setWidgetShowPicture(ui->widgetShowPicture);
    ui->widgetSelectRectTopLeft->setRect(m_windowSkin.topLeft());
}

// -------------------------------------------------------

void DialogSystemWindowSkin::updateZoom(int zoom) {
    m_zoom = 1.0;
    if (zoom > 0)
        m_zoom *= (zoom + 1);
    else if (zoom < 0)
        m_zoom /= ((-zoom) + 1);
    ui->horizontalSlider->setValue(zoom);
    ui->widgetShowPicture->setCoef(m_zoom);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemWindowSkin::on_pictureChanged(SystemPicture *picture) {
    m_windowSkin.setPictureID(picture->id());
    ui->widgetShowPicture->updatePicture(picture, PictureKind::WindowSkins);
}

// -------------------------------------------------------

void DialogSystemWindowSkin::on_horizontalSlider_valueChanged(int value) {
    updateZoom(value);

    // Update in the settings
    RPM::get()->engineSettings()->setZoomPictures(value);
}
