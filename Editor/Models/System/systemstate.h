/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef SYSTEMSTATE_H
#define SYSTEMSTATE_H

#include <QMetaType>
#include "superlistitem.h"
#include "systemobjectevent.h"
#include "mapeditorsubselectionkind.h"

// -------------------------------------------------------
//
//  CLASS SystemState
//
//  A particulary state (datas).
//
// -------------------------------------------------------

class SystemState : public SuperListItem
{
public:
    SystemState();
    SystemState(SuperListItem* state, MapEditorSubSelectionKind gk, int gid,
                int x, int y, bool m, bool s, bool cl, bool d, bool t, bool c,
                bool p, bool k);
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
    bool m_moveAnimation;
    bool m_stopAnimation;
    bool m_climbAnimation;
    bool m_directionFix;
    bool m_through;
    bool m_setWithCamera;
    bool m_pixelOffset;
    bool m_keepPosition;
};

Q_DECLARE_METATYPE(SystemState)

#endif // SYSTEMSTATE_H
