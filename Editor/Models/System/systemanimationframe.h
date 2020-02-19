/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMANIMATIONFRAME_H
#define SYSTEMANIMATIONFRAME_H

#include <QMetaType>
#include "systemanimationframeelement.h"

// -------------------------------------------------------
//
//  CLASS SystemAnimationFrame
//
//  A particulary animation frame (datas).
//
// -------------------------------------------------------

class SystemAnimationFrame : public SuperListItem
{
public:
    static const QString JSON_ELEMENTS;

    SystemAnimationFrame();
    SystemAnimationFrame(int i, QString n);
    virtual ~SystemAnimationFrame();
    int elementsCount() const;
    SystemAnimationFrameElement * elementAt(int i) const;

    int getElementMaxIndex() const;
    void clear();
    SystemAnimationFrameElement * addElement(int x, int y, int row, int column);
    void addElement(SystemAnimationFrameElement *element);
    void deleteElement(SystemAnimationFrameElement *element);
    void reorder(SystemAnimationFrameElement *element);

    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QList<SystemAnimationFrameElement *> m_elements;
};

Q_DECLARE_METATYPE(SystemAnimationFrame)

#endif // SYSTEMANIMATIONFRAME_H
