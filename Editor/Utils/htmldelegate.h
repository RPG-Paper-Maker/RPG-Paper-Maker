/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef HTMLDELEGATE_H
#define HTMLDELEGATE_H

#include <QStyledItemDelegate>

// -------------------------------------------------------
//
//  CLASS HTMLDelegate
//
//  A class used to have html tags inside treeview items.
//
// -------------------------------------------------------

class HTMLDelegate : public QStyledItemDelegate
{
protected:
    void paint(QPainter *painter, const QStyleOptionViewItem &option, const
        QModelIndex &index ) const;
    QSize sizeHint(const QStyleOptionViewItem &option, const QModelIndex &index)
        const;
};

#endif // HTMLDELEGATE_H
