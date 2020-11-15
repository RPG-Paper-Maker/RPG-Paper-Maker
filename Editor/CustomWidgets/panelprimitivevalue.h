/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    explicit PanelPrimitiveValue(QWidget *parent = nullptr);
    ~PanelPrimitiveValue();

    QSpinBox * spinBoxNumber() const;
    QDoubleSpinBox * doubleSpinBoxNumber() const;
    PrimitiveValue * model() const;

    void updateModel();
    void initializePrimitives();
    void initializeParameterEvent(QStandardItemModel *properties,
        QStandardItemModel *parameters);
    void initializeNumberVariable();
    void initializeNumber(QStandardItemModel *parameters, QStandardItemModel
        *properties, bool isInteger = true);
    void initializeDataBaseCommandId(QStandardItemModel *dataBase,
        QStandardItemModel *parameters = nullptr, QStandardItemModel
        *properties = nullptr);
    void initializeMessage(bool formula, QStandardItemModel *parameters
        = nullptr, QStandardItemModel *properties = nullptr, bool showPrimitive =
        true);
    void initializeSwitch(QStandardItemModel *parameters, QStandardItemModel
        *properties);
    void initializeProperty(QStandardItemModel *parameters, QStandardItemModel
        *properties, bool isInteger = false);
    void initializeVariableParamProp(QStandardItemModel *parameters,
        QStandardItemModel *properties);
    void initializeFont(QStandardItemModel *parameters = nullptr,
        QStandardItemModel *properties = nullptr);
    void initializeAll(QStandardItemModel *parameters = nullptr,
        QStandardItemModel *properties = nullptr);
    void initializeModel(PrimitiveValue *m);
    void initializeNumberAndUpdate(PrimitiveValue *m, bool isInteger = true);
    void initializeNumberVariableAndUpdate(PrimitiveValue *m);
    void initializeDataBaseAndUpdate(PrimitiveValue *m);
    void initializeMessageAndUpdate(PrimitiveValue *m, bool formula);
    void initializePropertyAndUpdate(PrimitiveValue *m, QStandardItemModel
        *parameters, QStandardItemModel *properties);
    void initializeFontAndUpdate(PrimitiveValue *m);
    void initializeAllAndUpdate(PrimitiveValue *m);
    void setKind(PrimitiveValueKind kind);
    void setNumberValue(int n);
    void setNumberDoubleValue(double n);
    void setMessageValue(QString m);
    void setSwitchValue(bool s);
    void updateValue(bool update = false);
    void updateKind(bool update = false);
    void sync();
    void hideAll();
    void addDefault();
    void addAnything();
    void addNone();
    void addNumber();
    void addNumberDouble();
    void addVariable();
    void addParameter(QStandardItemModel *model);
    void addProperty(QStandardItemModel *model);
    void addDataBase(QStandardItemModel *model, PrimitiveValueKind kind =
        PrimitiveValueKind::DataBase);
    void addMessage(bool formula);
    void addScript();
    void addSwitch();
    void addKeyBoard();
    void addFont();
    void addCustomStructure(bool isList);
    void showDefault();
    void showAnything();
    void showNone();
    void showNumber();
    void showNumberDouble();
    void showVariable();
    void showParameter();
    void showProperty();
    void showDataBase();
    void showDataBaseCustom();
    void clearDataBase();
    void showMessage();
    void showScript();
    void showSwitch();
    void showKeyBoard();
    void showFront();
    void showCustomStructure(bool isList);
    void clear();
    int getKindIndex(PrimitiveValueKind kind);
    void initializeCommand(EventCommand *command, int &i);
    void getCommand(QVector<QString> &command);

protected:
    bool eventFilter(QObject *o, QEvent *e);

private:
    Ui::PanelPrimitiveValue *ui;
    PrimitiveValue *m_model;
    bool m_modelNeedDelete;
    PanelPrimitiveValueKind m_kind;

    void initialize();
    void translate();

signals:
    void numberUpdated(int i);

private slots:
    void on_comboBoxChoiceCurrentIndexChanged(int index);
    void on_spinBoxNumber_valueChanged(int i);
    void on_doubleSpinBoxNumber_valueChanged(double i);
    void on_variableChanged(QListWidgetItem *);
    void on_comboBoxParameterCurrentIndexChanged(int index);
    void on_comboBoxPropertyCurrentIndexChanged(int index);
    void on_comboBoxDataBaseCurrentIndexChanged(int index);
    void on_comboBoxKeyBoardCurrentIndexChanged(int index);
    void on_lineEditMessage_textChanged(const QString &text);
    void on_lineEditScript_textChanged(const QString &text);
    void on_comboBoxSwitch_currentIndexChanged(int index);
    void on_fontComboBox_currentIndexChanged(int);
};

#endif // PANELPRIMITIVEVALUE_H
