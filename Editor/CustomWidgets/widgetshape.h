/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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

signals:
    void shapeChanged();
};

#endif // WIDGETSHAPE_H
