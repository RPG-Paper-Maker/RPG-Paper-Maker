/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#ifndef PANELPRIMITIVEVALUE_H
#define PANELPRIMITIVEVALUE_H

#include <QWidget>
#include <QListWidgetItem>
#include <QSpinBox>
#include <QDoubleSpinBox>
#include "primitivevalue.h"
#include "eventcommand.h"
#include "panelprimitivevaluekind.h"

// -------------------------------------------------------
//
//  CLASS PanelPrimitiveValue
//
//  The panel for selecting a specific value (number, message,
//  switch).
//
// -------------------------------------------------------

namespace Ui {
class PanelPrimitiveValue;
}

class PanelPrimitiveValue : public QWidget
{
    Q_OBJECT

public:
    explicit PanelPrimitiveValue(QWidget *parent = 0);
    ~PanelPrimitiveValue();
    QSpinBox* spinBoxNumber() const;
    QDoubleSpinBox* doubleSpinBoxNumber() const;
    void initializePrimitives();
    void initializeParameterEvent();
    void initializeNumberVariable();
    void initializeNumber(QStandardItemModel* parameters,
                          QStandardItemModel* properties,
                          bool isInteger = true);
    void initializeDataBaseCommandId(QStandardItemModel* dataBase,
                                     QStandardItemModel* parameters,
                                     QStandardItemModel* properties);
    void initializeModel(PrimitiveValue* m);
    PrimitiveValue* model() const;
    void setKind(PrimitiveValueKind kind);
    void setNumberValue(int n);
    void setNumberDoubleValue(double n);
    void setMessageValue(QString m);
    void setSwitchValue(bool s);
    void updateValue();
    void hideAll();
    void addDefault();
    void addAnything();
    void addNone();
    void addNumber();
    void addNumberDouble();
    void addVariable();
    void addParameter(QStandardItemModel* model);
    void addProperty(QStandardItemModel* model);
    void addDataBase(QStandardItemModel* model);
    void addMessage();
    void addScript();
    void addSwitch();
    void addKeyBoard();
    void showDefault();
    void showAnything();
    void showNone();
    void showNumber();
    void showNumberDouble();
    void showVariable();
    void showParameter();
    void showProperty();
    void showDataBase();
    void showMessage();
    void showScript();
    void showSwitch();
    void showKeyBoard();
    int getKindIndex(PrimitiveValueKind kind);
    void initializeCommand(EventCommand *command, int &i);
    void getCommand(QVector<QString> &command);

private:
    Ui::PanelPrimitiveValue *ui;
    PrimitiveValue* m_model;
    bool m_modelNeedDelete;
    PanelPrimitiveValueKind m_kind;

    void initialize();

private slots:
    void on_comboBoxChoiceCurrentIndexChanged(int index);
    void on_spinBoxNumber_valueChanged(int i);
    void on_doubleSpinBoxNumber_valueChanged(double i);
    void on_variableChanged(QListWidgetItem*);
    void on_comboBoxParameterCurrentIndexChanged(int index);
    void on_comboBoxPropertyCurrentIndexChanged(int index);
    void on_comboBoxDataBaseCurrentIndexChanged(int index);
    void on_comboBoxKeyBoardCurrentIndexChanged(int index);
    void on_lineEditMessage_textChanged(const QString &text);
    void on_lineEditScript_textChanged(const QString &text);
    void on_comboBoxSwitch_currentIndexChanged(int index);
};

#endif // PANELPRIMITIVEVALUE_H
