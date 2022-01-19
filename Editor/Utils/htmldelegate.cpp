/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QPainter>
#include <QTextDocument>
#include <QAbstractTextDocumentLayout>
#include "htmldelegate.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void HTMLDelegate::paint(QPainter *painter, const QStyleOptionViewItem &option,
    const QModelIndex &index) const
{
    QStyleOptionViewItem options = option;
    initStyleOption(&options, index);
    painter->save();
    QTextDocument doc;
    doc.setHtml(options.text);
    options.text = "";
    options.widget->style()->drawControl(QStyle::CE_ItemViewItem, &options,
        painter);

    // Shift text right to make icon visible
    QSize iconSize = options.icon.actualSize(options.rect.size());
    painter->translate(options.rect.left()+iconSize.width(), options.rect.top());
    QRect clip(0, 0, options.rect.width()+iconSize.width(), options.rect.height());
    painter->setClipRect(clip);
    QAbstractTextDocumentLayout::PaintContext ctx;

    // Set text color to red for selected item
    if (RPM::get()->engineSettings()->theme() == ThemeKind::Dark)
    {
        ctx.palette.setColor(QPalette::Text, QColor("white"));
    } else
    {
        ctx.palette.setColor(QPalette::Text, QColor("black"));
    }
    ctx.clip = clip;
    doc.documentLayout()->draw(painter, ctx);

    painter->restore();
}

// -------------------------------------------------------

QSize HTMLDelegate::sizeHint(const QStyleOptionViewItem &option, const
    QModelIndex &index) const
{
    QStyleOptionViewItem options = option;
    initStyleOption(&options, index);
    QTextDocument doc;
    doc.setHtml(options.text);
    doc.setTextWidth(options.rect.width());
    return QSize(static_cast<int>(doc.idealWidth()), static_cast<int>(doc.size()
        .height()));
}
