/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef WIDGETPICTUREPREVIEW_H
#define WIDGETPICTUREPREVIEW_H

#include <QWidget>
#include "widgetselectionrectangle.h"
#include "systempicture.h"

// -------------------------------------------------------
//
//  CLASS WidgetPicturePreview
//
//  Represents the widget for preview picture.
//
// -------------------------------------------------------

class WidgetPicturePreview : public QWidget
{
    Q_OBJECT
public:
    explicit WidgetPicturePreview(QWidget *parent = 0);
    ~WidgetPicturePreview();
    SystemPicture * picture() const;
    void setPicture(SystemPicture *picture);
    void setKind(PictureKind kind);
    void setChooseRect(bool b);
    int indexX() const;
    void setIndexX(int i);
    int indexY() const;
    void setIndexY(int i);
    void setIsLimitIndex(bool isLimitIndex);
    void setImage(QString path);
    void setNoneImage();
    void updateImageSize();
    void updateRectangle();
    void updateRectangleCharacter();

protected:
    SystemPicture *m_picture;
    QImage m_image;
    float m_zoom;
    WidgetSelectionRectangle* m_selectionRectangle;
    PictureKind m_kind;
    bool m_chooseRect;
    int m_indexX;
    int m_indexY;
    bool m_isLimitIndex;

    virtual void mousePressEvent(QMouseEvent *event);
    virtual void paintEvent(QPaintEvent *);
};

#endif // WIDGETPICTUREPREVIEW_H
