/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMSTATE_H
#define SYSTEMSTATE_H

#include <QMetaType>
#include "superlistitem.h"
#include "systemobjectevent.h"
#include "mapeditorsubselectionkind.h"
#include "objectmovingkind.h"

// -------------------------------------------------------
//
//  CLASS SystemState
//
//  A particulary state of an object (datas).
//
// -------------------------------------------------------

class SystemState : public SuperListItem
{
public:
    static const QString JSON_OBJECT_MOVING_KIND;
    static const QString JSON_EVENT_COMMAND_ROUTE;
    static const QString JSON_SPEED_ID;
    static const QString JSON_FREQUENCY_ID;
    static const QString JSON_EVENT_COMMAND_DETECTION;

    SystemState();
    SystemState(SuperListItem* state, MapEditorSubSelectionKind gk, int gid,
        int x, int y, ObjectMovingKind omk, EventCommand *ecr, int sp, int fr,
        bool m, bool s, bool cl, bool d, bool t, bool c, bool p, bool k,
        EventCommand *ecd);
    virtual ~SystemState();

    virtual QString name() const;
    SuperListItem* state() const;
    void setState(SuperListItem* s);
    MapEditorSubSelectionKind graphicsKind() const;
    void setGraphicsKind(MapEditorSubSelectionKind k);
    int graphicsId() const;
    void setGraphicsId(int i);
    int indexX() const;
    void setIndexX(int i);
    int indexY() const;
    void setIndexY(int i);
    QRect rectTileset() const;
    void setRectTileset(QRect rect);
    ObjectMovingKind objectMovingKind() const;
    void setObjectMovingKind(ObjectMovingKind k);
    EventCommand * eventCommandRoute() const;
    void setEventCommandRoute(EventCommand *ecr);
    int speedID() const;
    void setSpeedID(int s);
    int frequencyID() const;
    void setFrequencyID(int f);
    bool moveAnimation() const;
    bool stopAnimation() const;
    bool climbAnimation() const;
    bool directionFix() const;
    bool through() const;
    bool setWithCamera() const;
    bool pixelOffset() const;
    bool keepPosition() const;
    void setMoveAnimation(bool b);
    void setStopAnimation(bool b);
    void setClimbAnimation(bool b);
    void setDirectionFix(bool b);
    void setThrough(bool b);
    void setSetWithCamera(bool b);
    void setPixelOffset(bool b);
    void setKeepPosition(bool b);
    EventCommand * eventCommandDetection() const;
    void setEventCommandDetection(EventCommand *ecd);

    void removeRoute();
    void removeDetection();

    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemState &state);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    SuperListItem* m_state;
    MapEditorSubSelectionKind m_graphicsKind;
    int m_graphicsId;
    int m_indexX;
    int m_indexY;
    QRect m_rectTileset;
    ObjectMovingKind m_objectMovingKind;
    EventCommand *m_eventCommandRoute;
    int m_speedID;
    int m_frequencyID;
    bool m_moveAnimation;
    bool m_stopAnimation;
    bool m_climbAnimation;
    bool m_directionFix;
    bool m_through;
    bool m_setWithCamera;
    bool m_pixelOffset;
    bool m_keepPosition;
    EventCommand *m_eventCommandDetection;
};

Q_DECLARE_METATYPE(SystemState)

#endif // SYSTEMSTATE_H
