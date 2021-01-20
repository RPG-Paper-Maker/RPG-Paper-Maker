/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef WIDGETANIMATION_H
#define WIDGETANIMATION_H

#include <QWidget>
#include <QScrollArea>
#include <QTimer>
#include "systemanimationframe.h"
#include "animationpositionkind.h"
#include "widgetanimationtexture.h"
#include "contextmenulist.h"
#include "systempicture.h"
#include "animationeffectconditionkind.h"

// -------------------------------------------------------
//
//  CLASS WidgetAnimation
//
//  Widget used for creating animations.
//
// -------------------------------------------------------

class WidgetAnimation : public QWidget
{
    Q_OBJECT
public:
    static const int ELEMENT_INDEX_SIZE;

    explicit WidgetAnimation(QWidget *parent = nullptr);
    ~WidgetAnimation();
    void setScrollArea(QScrollArea *scrollArea);
    void setAnimationPositionKind(AnimationPositionKind pk);
    void setCurrentFrame(SystemAnimationFrame *cf);
    void setWidgetAnimationTexture(WidgetAnimationTexture *wat);
    SystemAnimationFrameElement * selectedElement() const;

    SystemPicture * pictureBattler() const;
    void updateBattlerPicture(int id);
    void playAnimation(AnimationEffectConditionKind condition,
        QStandardItemModel *modelFrames);

protected:
    ContextMenuList *m_contextMenu;
    QScrollArea *m_scrollArea;
    QImage m_imageBattler;
    int m_idBattler;
    QString m_textCoords;
    AnimationPositionKind m_positionKind;
    SystemAnimationFrame *m_currentFrame;
    WidgetAnimationTexture *m_widgetAnimationTexture;
    SystemAnimationFrameElement *m_hoveredElement;
    SystemAnimationFrameElement *m_selectedElement;
    SystemAnimationFrameElement *m_copiedElement;
    bool m_moving;
    int m_mouseOffsetX;
    int m_mouseOffsetY;
    int m_lastMouseX;
    int m_lastMouseY;
    int m_currentPlayedFrameID;
    QStandardItemModel *m_modelFrames;
    AnimationEffectConditionKind m_condition;
    SystemAnimationFrame *m_currentPlayedFrame;

    void updateContextMenuCan();

    virtual void keyPressEvent(QKeyEvent *event);
    virtual void mouseDoubleClickEvent(QMouseEvent *);
    virtual void mouseMoveEvent(QMouseEvent *event);
    virtual void mousePressEvent(QMouseEvent *event);
    virtual void mouseReleaseEvent(QMouseEvent *);
    virtual void mouseLeaveEvent(QMouseEvent *);
    virtual void paintEvent(QPaintEvent *);

signals:
    void animationFinished();

private slots:
    void showContextMenu(const QPoint &p);
    void contextEdit();
    void contextCopy();
    void contextPaste();
    void contextDelete();
    void updateAnimation();
};

#endif // WIDGETANIMATION_H
