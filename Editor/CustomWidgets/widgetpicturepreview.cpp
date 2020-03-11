/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "widgetpicturepreview.h"
#include "rpm.h"
#include <QPainter>

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetPicturePreview::WidgetPicturePreview(QWidget *parent) :
    QWidget(parent),
    m_selectionRectangle(new WidgetSelectionRectangle),
    m_chooseRect(false),
    m_indexX(0),
    m_indexY(0)
{
    this->translate();
}

WidgetPicturePreview::~WidgetPicturePreview()
{
    delete m_selectionRectangle;
}

void WidgetPicturePreview::setKind(PictureKind kind) { m_kind = kind; }

void WidgetPicturePreview::setChooseRect(bool b) { m_chooseRect = b; }

int WidgetPicturePreview::indexX() const { return m_indexX; }

void WidgetPicturePreview::setIndexX(int i) {
    int frames = RPM::get()->project()->gameDatas()->systemDatas()
            ->framesAnimation();
    if (i >= frames)
        i = frames - 1;

    m_indexX = i;

    updateRectangle();
}

int WidgetPicturePreview::indexY() const { return m_indexY; }

void WidgetPicturePreview::setIndexY(int i) {
    if (i >= 4)
        i = 3;

    m_indexY = i;

    updateRectangle();
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetPicturePreview::setImage(QString path){
    m_image.load(path);
    updateImageSize();
}

// -------------------------------------------------------

void WidgetPicturePreview::setNoneImage(){
    m_image = QImage();
    updateImageSize();
}

// -------------------------------------------------------

void WidgetPicturePreview::updateImageSize(){

    float coef = RPM::coefReverseSquareSize();

    // Set selector
    if (m_chooseRect && !m_image.isNull()){
        int frames = RPM::get()->project()->gameDatas()->systemDatas()
                ->framesAnimation();

        switch (m_kind){
        case PictureKind::Characters:
            m_selectionRectangle->setSquareWidth(m_image.width() *
                                                 coef / frames);
            m_selectionRectangle->setSquareHeight(m_image.height() *
                                                  coef/ 4);
            updateRectangleCharacter();
            break;
        default:
            break;
        }
    }

    // Set size
    if (m_chooseRect && !m_image.isNull() &&
        (m_kind == PictureKind::Characters || m_kind == PictureKind::Tilesets))
    {
        m_image = m_image.scaled(m_image.width() * coef,
                                 m_image.height() * coef);
    }
    this->setGeometry(0, 0, m_image.width(), m_image.height());
    setFixedSize(m_image.width(), m_image.height());
}

// -------------------------------------------------------

void WidgetPicturePreview::updateRectangle(){
    switch (m_kind){
    case PictureKind::Characters:
        updateRectangleCharacter(); break;
    default:
        break;
    }
}

// -------------------------------------------------------

void WidgetPicturePreview::updateRectangleCharacter(){
    m_selectionRectangle->setRectangle(m_indexX, m_indexY, 1, 1);
}

//-------------------------------------------------

void WidgetPicturePreview::translate()
{

}

// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

void WidgetPicturePreview::mousePressEvent(QMouseEvent *event){
    if (event->button() == Qt::MouseButton::LeftButton){
        m_selectionRectangle->makeFirstSelection(event->pos().x(),
                                                 event->pos().y(),
                                                 1.0f);
        QRect rect;
        m_selectionRectangle->getCoefRect(rect);
        m_indexX = rect.x();
        m_indexY = rect.y();
        this->repaint();
    }
}

// -------------------------------------------------------

void WidgetPicturePreview::paintEvent(QPaintEvent *){
    QPainter painter(this);

    painter.fillRect(QRect(0, 0, m_image.width(), m_image.height()),
                     RPM::COLOR_ALMOST_TRANSPARENT);
    painter.drawImage(0, 0, m_image);

    if (m_chooseRect && m_kind == PictureKind::Characters)
        m_selectionRectangle->draw(painter);
}
