/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef WIDGETTABLEPROGRESSION_H
#define WIDGETTABLEPROGRESSION_H

#include <QTableWidget>
#include "systemprogressiontable.h"
#include "widgetchart.h"

class WidgetTableProgression : public QTableWidget
{
    Q_OBJECT
public:
    static const QColor EDITED_COLOR;
    static const QColor SUB_EDITED_COLOR;

    explicit WidgetTableProgression(QWidget *parent = nullptr);
    ~WidgetTableProgression();
    void setEditable(bool b);
    QHash<int, int> * table();
    void setTable(QHash<int, int> *table);
    WidgetTableProgression * totalWidget() const;
    void setTotalWidget(WidgetTableProgression *w);
    void setEditedColor(const QColor &color);

    void initialize(int rows, QString progression);
    void updateWithBaseInflation(int base, double inflation, int maxLevel,
        QHash<int, int> *subTable = nullptr);
    void updateWithEasing(SystemProgressionTable* progression, WidgetChart
        *chartView, int finalLevel);
    void updateTotal();

protected:
    bool m_completing;
    QHash<int, int> *m_table;
    WidgetTableProgression *m_totalWidget;
    QColor m_editedColor;

public slots:
    void on_cellChanged(int row, int column);
};

#endif // WIDGETTABLEPROGRESSION_H
