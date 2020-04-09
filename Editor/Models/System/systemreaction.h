/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMREACTION_H
#define SYSTEMREACTION_H

#include <QJsonObject>
#include <QJsonArray>
#include "eventcommand.h"
#include "superlistitem.h"

// -------------------------------------------------------
//
//  CLASS SystemReaction
//
//  A particular reaction.
//
// -------------------------------------------------------

class SystemReaction : public SuperListItem
{
public:
    SystemReaction();
    SystemReaction(int i, QString n, QStandardItemModel *commands, bool bHero);
    virtual ~SystemReaction();
    QStandardItemModel* modelCommands() const;
    bool blockingHero() const;
    void setBlockingHero(bool b);
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem& super);
    static void addEmptyCommand(QStandardItem *root);
    static void addCommand(QStandardItem *root, EventCommand* command);
    static void addCommandWithoutText(QStandardItem *root,
                                      EventCommand* command);
    static void deleteCommands(QStandardItem* item);
    static void copyCommands(const QStandardItemModel *from,
                             QStandardItemModel *to);
    static void copyCommandsItem(const QStandardItem *from, QStandardItem* to);

    void read(const QJsonObject &json);
    void write(QJsonObject &json) const;

protected:
    QStandardItemModel* m_modelCommands; // A tree with EventCommands data
    bool m_blockingHero;

private:
    void readRoot(const QJsonArray &json, QStandardItem* root);
    QJsonArray getChildrenJSON(QStandardItem* item) const;
};

#endif // SYSTEMREACTION_H
