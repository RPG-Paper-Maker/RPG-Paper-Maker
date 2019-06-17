/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef WIDGETSHAPE_H
#define WIDGETSHAPE_H

#include <QWidget>
#include <QListWidget>
#include "primitivevalue.h"
#include "systemcustomshape.h"

// -------------------------------------------------------
//
//  CLASS WidgetShape
//
//  Widget used for choosing a shape existing in the database.
//
// -------------------------------------------------------

namespace Ui {
class WidgetShape;
}

class WidgetShape : public QWidget
{
    Q_OBJECT

public:
    explicit WidgetShape(QWidget *parent = nullptr);
    ~WidgetShape();
    QListWidget* list() const;
    void setKind(CustomShapeKind kind);
    void initialize(SuperListItem *shapeID);
    void update();
    void openDialog();

private:
    Ui::WidgetShape *ui;
    CustomShapeKind m_kind;
    SuperListItem *m_shapeID;

private slots:
    void on_listWidget_itemDoubleClicked(QListWidgetItem*);
    void on_pushButton_clicked();
};

#endif // WIDGETSHAPE_H
